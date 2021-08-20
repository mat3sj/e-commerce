from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def get_router(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        '/api/products/top/',
        '/api/products/<id>',
        '/api/products/<id>/reviews',


    ]
    return JsonResponse(routes, safe=False)