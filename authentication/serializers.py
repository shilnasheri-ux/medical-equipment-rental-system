# apps/authentication/serializers.py

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles new user registration.
    Accepts: first_name, last_name, username, email, password, password2
    Returns: user data (no password)
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],  # enforces Django's password rules
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        label='Confirm Password',
    )

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password2',
        )
        extra_kwargs = {
            'email':      {'required': True},
            'first_name': {'required': True},
            'last_name':  {'required': True},
        }

    # ── Validation ────────────────────────────────────────────────────────────

    def validate_email(self, value):
        """Reject duplicate emails since Django doesn't enforce uniqueness by default."""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'An account with this email already exists.'
            )
        return value.lower()  # store emails in lowercase always

    def validate(self, attrs):
        """Check that both password fields match."""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match.'}
            )
        return attrs

    # ── Save ──────────────────────────────────────────────────────────────────

    def create(self, validated_data):
        """
        Remove password2 (not a model field), then create the user
        using create_user() so the password gets properly hashed.
        Never use User.objects.create() directly — it stores plain text.
        """
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extends the default JWT login serializer.
    Adds user's id, email, name, and staff status
    directly inside the token payload and the login response.
    This means React never needs a separate /profile API call
    just to know who is logged in.
    """

    @classmethod
    def get_token(cls, user):
        """Embed extra fields inside the JWT token itself."""
        token = super().get_token(user)

        # These fields travel inside the token payload
        token['username']   = user.username
        token['email']      = user.email
        token['full_name']  = f'{user.first_name} {user.last_name}'.strip()
        token['is_staff']   = user.is_staff

        return token

    def validate(self, attrs):
        """
        Calls the parent validate (which checks credentials and
        returns access + refresh tokens), then adds extra user
        data to the response body so the frontend can read it
        without decoding the JWT.
        """
        data = super().validate(attrs)

        # Add readable user info alongside the tokens in the response
        data['user'] = {
            'id':        self.user.id,
            'username':  self.user.username,
            'email':     self.user.email,
            'full_name': f'{self.user.first_name} {self.user.last_name}'.strip(),
            'is_staff':  self.user.is_staff,
        }

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for returning the logged-in user's
    profile data from the /api/auth/profile/ endpoint.
    Password is excluded entirely.
    """

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_staff',
            'date_joined',
        )
        read_only_fields = fields  # nothing is editable through this serializer

    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip() or obj.username