from django.contrib import admin
from .models import CustomUser,Order,File, Message, Request


admin.site.register(CustomUser)
admin.site.register(Order)
admin.site.register(File)
admin.site.register(Message)
admin.site.register(Request)