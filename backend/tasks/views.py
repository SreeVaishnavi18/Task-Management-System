# views.py
#views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt,datetime
from django.conf import settings
from db_connection import db
import hashlib
from bson.objectid import ObjectId
from rest_framework.exceptions import NotFound
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser
# Assigning collections to variables
users_collection = db['users']
tasks_collection = db['tasks']
task_assignments_collection = db['task_assignments']

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if users_collection.find_one({"email": email}):
            return Response({'message': 'User already exists'}, status=400)

        hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()

        # Check if the user should be an admin
        #is_admin = username == 'admin' and password == 'admin123'

        user = {
            "username": username,
            "password": hashed_password,
            "email": email,
            #"is_admin": is_admin  # Automatically set is_admin based on username and password
        }

        users_collection.insert_one(user)
        return Response({'message': 'User created successfully'}, status=201)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            raise AuthenticationFailed('Email and password are required')

        user = users_collection.find_one({"username": username})

        if user is None:
            raise AuthenticationFailed('User not found')

        if user['password'] != hashlib.sha256(password.encode('utf-8')).hexdigest():
            raise AuthenticationFailed('Incorrect password')
        
        is_admin = (username == 'admin' and password == 'admin123')  # Check if admin user

        

        payload = {
            'id': str(user['_id']),
            'is_admin': is_admin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'access': token,
            'username': user['username'],
            'message': 'Login successful'
        }
        return response


class AddTaskView(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')  

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256']) 
            is_admin = payload.get('is_admin', False)  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  

        if not is_admin:
            raise PermissionDenied('Only admins can add tasks!')

        title = request.data.get('title')
        description = request.data.get('description')
        due_date = request.data.get('due_date')

        if not title or not description:
            return Response({'message': 'Title and description are required'}, status=400)
        
        if due_date:
            try:
                due_date = datetime.datetime.strptime(due_date, '%d-%m-%Y')
            except ValueError:
                return Response({'message': 'Invalid date format. Use DD-MM-YYYY.'}, status=400)
        else:
            due_date = None

        task = {
            'title': title,
            'description': description,
            'status': '',
            'due_date': due_date,
            'created_at': datetime.datetime.utcnow(),
            'updated_at': datetime.datetime.utcnow(),
        }

        result = tasks_collection.insert_one(task)
        task['_id'] = str(result.inserted_id)

        return Response({'message': 'Task added successfully', 'task': task}, status=201)


class TaskListView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')  

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!') 

        is_admin = payload.get('is_admin', False)

        if not is_admin:
            raise PermissionDenied('Only admins can view tasks!')



      
        tasks = tasks_collection.find()
        task_list = []

        for task in tasks:
            task['_id'] = str(task['_id']) 
            task_list.append(task)

        return Response({'tasks': task_list}, status=200)

class TaskDetailView(APIView):
    '''def get_object(self, task_id):
        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        if not task:
            raise NotFound('Task not found')
        return task'''
    
    def get_object(self, request, task_id):
        token = request.COOKIES.get('jwt')  
        if not token:
            raise AuthenticationFailed('Unauthenticated!')  
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  

        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        if not task:
            raise NotFound('Task not found')
        
        is_admin = payload.get('is_admin', False)

        if not is_admin:
            raise PermissionDenied('Only admins can update tasks!')
        
        task['_id'] = str(task['_id']) 
        return task
    
    def get(self, request, task_id):
        task = self.get_object(request, task_id)  
        return Response(task)
    


    def put(self, request, task_id):
        token = request.COOKIES.get('jwt') 

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  
        
        is_admin = payload.get('is_admin', False)

        if not is_admin:
            raise PermissionDenied('Only admins can update tasks!')

        title = request.data.get('title')
        description = request.data.get('description')

        if not title or not description:
            return Response({'message': 'Title and description are required'}, status=400)

        updated_task = {
            'title': title,
            'description': description,
            'status': request.data.get('status', 'pending'),  
            'due_date': request.data.get('due_date', None),  
            #'created_at': task['created_at'],
            'updated_at': datetime.datetime.utcnow()
        }

        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': updated_task}
        )

        updated_task['_id'] = task_id  

        return Response({'message': 'Task updated successfully', 'task': updated_task})


class DeleteTask(APIView):
    def get_object(self, task_id):
        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        if not task:
            raise NotFound('Task not found')
        return task

    def delete(self, request, task_id):
        token = request.COOKIES.get('jwt')  
        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  
        
        is_admin = payload.get('is_admin', False)

        if not is_admin:
            raise PermissionDenied('Only admins can delete tasks!')


        task = self.get_object(task_id)
        tasks_collection.delete_one({'_id': task['_id']})

        return Response({'message': 'Task deleted successfully'}, status=204)


class UserListView(APIView):
    def get(self, request):
        
        users = list(users_collection.find())  # Query to get all user details

        formatted_users = []
        for user in users:
            user['_id'] = str(user['_id'])  
            formatted_users.append({
                'id': user['_id'],
                'username': user['username'],
                'email': user['email'],  
            })
        
        return Response({'users': formatted_users}, status=200)
class AssignTaskView(APIView):
    def post(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        admin = users_collection.find_one({"_id": ObjectId(payload['id'])})
        
        if admin['username'] != 'admin':
            return Response({'message': 'Only admins can assign tasks'}, status=403)

        task_id = request.data.get('task_id')
        user_id = request.data.get('user_id')
        #status = request.data.get('status', 'assigned')
        due_date = request.data.get('due_date', None)

        if not task_id or not user_id:
            return Response({'message': 'Task ID and User ID are required'}, status=400)

        task = tasks_collection.find_one({"_id": ObjectId(task_id)})
        if not task:
            return Response({'message': 'Task not found'}, status=404)

        user_to_assign = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user_to_assign:
            return Response({'message': 'User not found'}, status=404)

        existing_assignment = task_assignments_collection.find_one({
            'task_id': ObjectId(task_id),
            'user_id': ObjectId(user_id)
        })
        if existing_assignment:
            return Response({'message': 'This task is already assigned to this user'}, status=400)

        task_assignment = {
            'task_id': ObjectId(task_id),
            'user_id': ObjectId(user_id),
            'assigned_at': datetime.datetime.utcnow(),
            'status': '',
            'due_date': due_date
        }

        task_assignments_collection.insert_one(task_assignment)

        task_assignment['_id'] = str(task_assignment['_id'])
        task_assignment['task_id'] = str(task_assignment['task_id'])
        task_assignment['user_id'] = str(task_assignment['user_id'])

        return Response({'message': 'Task assigned successfully', 'task_assignment': task_assignment}, status=201)


class ViewAssignedTasksView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user_id = ObjectId(payload['id'])

        assignments = task_assignments_collection.find({'user_id': user_id})
        assigned_tasks = []

        for assignment in assignments:
            task = tasks_collection.find_one({'_id': assignment['task_id']})
            if task:
                task_info = {
                    'task_id': str(task['_id']),
                    'title': task.get('title', ''),
                    'description': task.get('description', ''),
                    'due_date': task.get('due_date', ''),
                    'status': assignment.get('status', ''),
                    'assigned_at': assignment.get('assigned_at', ''),
                }
                assigned_tasks.append(task_info)

        return Response({'assigned_tasks': assigned_tasks}, status=200)


class FilterTasksByAssignedUserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')  

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  

        assigned_user_id = request.query_params.get('assigned_user_id')

        if not assigned_user_id:
            return Response({'message': 'Assigned user ID parameter is required'}, status=400)

        try:
            assigned_user_id = ObjectId(assigned_user_id)
        except:
            return Response({'message': 'Invalid user ID format'}, status=400)

        assignments = task_assignments_collection.find({'user_id': assigned_user_id})

        task_list = []
        for assignment in assignments:
            task = tasks_collection.find_one({'_id': assignment['task_id']})
            if task:
                task_info = {
                    'task_id': str(task['_id']),
                    'title': task.get('title', ''),
                    'description': task.get('description', ''),
                    'due_date': task.get('due_date', ''),
                    'status': assignment.get('status', ''),
                    'assigned_at': assignment.get('assigned_at', ''),
                }
                task_list.append(task_info)

        return Response({'tasks': task_list}, status=200)
    

class SearchTasksView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt') 

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  
        user_id = ObjectId(payload['id'])  

        query = request.query_params.get('query', '')

        if not query:
            return Response({'message': 'Query parameter is required'}, status=400)
        
        assigned_task_ids = task_assignments_collection.find({'user_id': user_id}, {'task_id': 1})
        assigned_task_ids = [task['task_id'] for task in assigned_task_ids]


        tasks = tasks_collection.find({
            '_id': {'$in': assigned_task_ids},
            '$or': [
                {'title': {'$regex': query, '$options': 'i'}},
                {'description': {'$regex': query, '$options': 'i'}}
            ]
        })

        task_list = []
        for task in tasks:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string
            task_list.append(task)

        return Response({'tasks': task_list}, status=200)


class FilterTasksByDeadlineView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')  

        if not token:
            raise AuthenticationFailed('Unauthenticated!')  

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')  
        
        user_id = ObjectId(payload['id']) 
        
        deadline = request.query_params.get('deadline')
        
        
        if not deadline:
            return Response({'message': 'Deadline parameter is required'}, status=400)

        try:
            deadline_date = datetime.datetime.strptime(deadline, '%d-%m-%Y')

        except ValueError:
            return Response({'message': 'Invalid date format. Use DD-MM-YYYY.'}, status=400)

        '''tasks = tasks_collection.find({
            'due_date': deadline_date,
            '_id': {'$in': [task['_id'] for task in task_assignments_collection.find({'user_id': user_id})]}
        })'''
        assigned_task_ids = [task['task_id'] for task in task_assignments_collection.find({'user_id': user_id})]

        tasks = tasks_collection.find({
            '_id': {'$in': assigned_task_ids},
            'due_date': {'$eq': deadline_date}
        })
        task_list = []
        for task in tasks:
            task['_id'] = str(task['_id'])
            task_list.append(task)
        return Response({'tasks': task_list}, status=200)


class FilterTasksByStatusView(APIView):
    def get(self, request):
        try:
            token = request.COOKIES.get('jwt')

            if not token:
                raise AuthenticationFailed('Unauthenticated!')  

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])  
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated!')  

            status = request.query_params.get('status')

            if not status:
                return Response({'message': 'Status parameter is required'}, status=400)

            if status not in ['pending', 'completed']:
                return Response({'message': 'Invalid status. Should be "pending" or "completed".'}, status=400)

            user_id = ObjectId(payload['id'])
            task_assignments_collection = db['task_assignments']


            tasks = tasks_collection.find({
                '$and': [
                    {'status': status},
                    {'_id': {'$in': [assignment['task_id'] for assignment in task_assignments_collection.find({'user_id': user_id, 'status': status})]}}
                ]
            })

            task_list = []
            for task in tasks:
                task['_id'] = str(task['_id'])  
                task_list.append(task)

            return Response({'tasks': task_list}, status=200)

        except Exception as e:
            return Response({'error': str(e)}, status=500)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'Logout successful'
        }
        return response



class UpdateTaskStatusView(APIView):
    def post(self, request, task_id):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user_id = ObjectId(payload['id'])
        new_status = request.data.get('status')

        if new_status not in ['pending', 'completed']:
            return Response({'message': 'Invalid status'}, status=400)

        assignment = task_assignments_collection.find_one({
            'task_id': ObjectId(task_id),
            'user_id': user_id
        })
        if not assignment:
            return Response({'message': 'Task is not assigned to you'}, status=403)

        task_assignments_collection.update_one(
            {'task_id': ObjectId(task_id), 'user_id': user_id},
            {'$set': {'status': new_status}}
        )
        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {'status': new_status}}
        )
        return Response({'message': 'Task status updated successfully'}, status=200)



