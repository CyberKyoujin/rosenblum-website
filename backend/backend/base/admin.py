from django.contrib import admin
from .models import CustomUser,Order,File, Message, RequestObject, Review, ReviewTranslation


admin.site.register(CustomUser)
admin.site.register(Order)
admin.site.register(File)
admin.site.register(Message)
admin.site.register(RequestObject)
admin.site.register(Review)
admin.site.register(ReviewTranslation)