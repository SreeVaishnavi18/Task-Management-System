from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView
#from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
#from .views import RegisterView, LoginView, logout, TaskListCreateView, TaskDetailView
#from .views import register, login, logout_user, task_list, task_detail

from django.urls import path
from .views import RegisterView, LoginView,AddTaskView,TaskListView,TaskDetailView,DeleteTask,AssignTaskView,ViewAssignedTasksView,SearchTasksView,FilterTasksByDeadlineView,UpdateTaskStatusView,FilterTasksByStatusView,FilterTasksByAssignedUserView,UserListView,LogoutView

urlpatterns = [
    #path('', views.index),  # Example view for the index endpoint
    # Add more paths as needed for your application
    # path('add/', views.add_person),
    # path('show/', views.get_all_person),
    #path('auth/register/', RegisterView.as_view(), name='register'),
    #path('auth/login/', LoginView.as_view(), name='login'),
    #path('auth/logout/', logout, name='logout'),
    #path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    #path('tasks/create/', create_task, name='task-create'),
    #path('tasks/<str:task_id>/', TaskDetailView.as_view(), name='task-detail'),
    #path('auth/register/', register, name='register'),
    #path('auth/login/', login, name='login'),
    #path('auth/logout/', logout_user, name='logout'),
    #path('tasks/', task_list, name='task-list'),
    #path('tasks/<str:pk>/', task_detail, name='task-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('add/', AddTaskView.as_view(), name='add'),
    path('read/', TaskListView.as_view(), name='read'),
    path('update/<str:task_id>/', TaskDetailView.as_view(), name='update'),
    path('get_object/<str:task_id>/',TaskDetailView.as_view(),name='get_object'),
    path('delete/<str:task_id>/', DeleteTask.as_view(), name='delete'),
    path('assign/', AssignTaskView.as_view(), name='assign'),
    path('viewassign/', ViewAssignedTasksView.as_view(), name='viewassign'),
    path('search/',SearchTasksView.as_view(), name='search'),
    path('filter/',FilterTasksByDeadlineView.as_view(), name='filter'),
    path('filterbystatus/',FilterTasksByStatusView.as_view(), name='filterstatus'),
    path('filterbyuser/',FilterTasksByAssignedUserView.as_view(), name='filterbyuser'),
    path('updatestatus/<str:task_id>/', UpdateTaskStatusView.as_view(), name='updatestatus'),
    path('userss/', UserListView.as_view(), name='userss'),
    path('logout/', LogoutView.as_view(), name='userss'),




    #path('upload/<str:task_id>/', FileUploadView.as_view(), name='upload')


]
