from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from .views import RegisterViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet)
router.register("register", RegisterViewSet, basename="register")
urlpatterns = router.urls
