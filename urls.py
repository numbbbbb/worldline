# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from views import index,showlogin,login,worldline,register,add,delcontext,about,privacy,questions,logout
from django.conf.urls.static import static 
import settings

# Uncomment the next two lines to enable the admin:

from django.contrib import admin
admin.autodiscover()
urlpatterns = patterns('',
	(r'^static/(?P<path>.*)$','django.views.static.serve',
		{'document_root':settings.STATICFILES_DIRS, 'show_indexes': True}),
	(r'^$',index),
	(r'^showlogin/$',showlogin),
	(r'^login/$',login),
	(r'^register/$',register),
	(r'^worldline/$',worldline),
	(r'^add/$',add),
	(r'^delcontext/$',delcontext),
	(r'^about/$',about),
	(r'^privacy/$',privacy),
	(r'^questions/$',questions),
	(r'^logout/$',logout),
	url(r'^admin/',include(admin.site.urls)),
    # Examples:
    # url(r'^$', 'worldline.views.home', name='home'),
    # url(r'^worldline/', include('worldline.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
