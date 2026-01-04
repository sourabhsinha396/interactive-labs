from sqladmin import ModelView
from database.models.user import User


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.username, User.email, User.full_name, User.is_staff, User.is_superuser, User.is_active]
    column_searchable_list = [User.username, User.email, User.full_name]
    can_delete = True
    can_edit = True
    can_view = True