# serializers.py
import hashlib
from rest_framework import serializers
from db_connection import db

class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            raise serializers.ValidationError("All fields (username, email, password) are required.")

        # Hash the password using hashlib
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        # Add the hashed password to data for storage
        data['password'] = hashed_password

        return data



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        # Hash the provided password to match the stored hashed password
        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        # Query your MongoDB to find the user with the provided username
        user = db.users.find_one({'username': username})

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        # Compare hashed passwords
        if user['password'] != hashed_password:
            raise serializers.ValidationError("Invalid username or password")

        return data

class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(max_length=100)
    description = serializers.CharField()
    status = serializers.CharField(max_length=20)
    due_date = serializers.DateTimeField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
