# permissions.py
from rest_framework.permissions import BasePermission
from db_connection import db

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        username = request.user['username']
        user_data = db.users.find_one({'username': username})
        return user_data and user_data.get('is_admin', False)
