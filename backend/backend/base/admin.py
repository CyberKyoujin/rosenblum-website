from django.contrib import admin
from .models import CustomUser,Invoice, Translation, Order,File, Message, RequestObject, CostEstimate, RequestAnswer, Review, ReviewTranslation, EmailVerification, Document


admin.site.register(CustomUser)
admin.site.register(Order)
admin.site.register(File)
admin.site.register(Message)
admin.site.register(RequestObject)
admin.site.register(Review)
admin.site.register(ReviewTranslation)
admin.site.register(EmailVerification)
admin.site.register(RequestAnswer)
admin.site.register(Translation)
admin.site.register(Document)
admin.site.register(CostEstimate)
admin.site.register(Invoice)