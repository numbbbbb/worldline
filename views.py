#coding:UTF-8
from django.http import HttpResponse
from django.template.loader import get_template
from django.shortcuts import render_to_response
from django.utils import simplejson 
from base.models import User,Idea
import datetime
import time
import collections

def index(request):
	try:
		if not request.session['iflog']:
			raise
		name1 = request.session['username']
		ideas = Idea.objects.filter(name__name=name1).order_by('date')
		text1 = []
		line1 = ["100","150"]
		year1 = []
		month1 = []
		numb1 = []
		secs = []
		for x in ideas:
			if (str(x.date)[5:7]+'.'+str(x.date)[8:10] in month1)and(str(x.date)[0:4] in year1):
				numb1[-1] += '.'
				text1[len(text1)-1].append(x.text)
				continue
			text1.append([x.text])
			numb1.append('.')
			secs.append(time.mktime(time.strptime(str(x.date),"%Y-%m-%d %H:%M:%S")))
			year1.append(str(x.date)[0:4])
			month1.append(str(x.date)[5:7]+'.'+str(x.date)[8:10])
		for x in range(1,len(month1)):		
			line1.append(int(line1[-1])+(int(secs[x])-int(secs[x-1]))/800)
		if len(month1)!=1:
			line1 = line1[1:]
		return render_to_response('worldline.html',locals())
	except:
		return render_to_response('index.html',locals())
	
def showlogin(request):
	return render_to_response('showlogin.html',locals())
	
def login(request):
	name1 = request.POST['username']
	pwd = request.POST['password']
	if name1 == u"用户名":
		return HttpResponse(simplejson.dumps({'result':'missing_username'}))
	if pwd == "":
		return HttpResponse(simplejson.dumps({'result':'missing_password'}))
	try:
		user = User.objects.get(name=name1)
	except:
		return HttpResponse(simplejson.dumps({'result':'unknown_username'}))
	if user.password != pwd:
		return HttpResponse(simplejson.dumps({'result':'wrong_password'}))
	request.session['iflog'] = True
	request.session['username'] = name1
	return HttpResponse(simplejson.dumps({'result':'ok'}))
	
def register(request):
	name1 = request.POST['username']
	pwd1 = request.POST['password']
	pwd2 = request.POST['password2']
	if name1 == u"用户名":
		return HttpResponse(simplejson.dumps({'result':'missing_username'}))
	if pwd1 == "":
		return HttpResponse(simplejson.dumps({'result':'missing_password'}))
	for x in name1:
		if (not x.isdigit())and(not x.islower()):
			return HttpResponse(simplejson.dumps({'result':'bad_username'}))
	try:
		user = User.objects.get(name=name1)
		return HttpResponse(simplejson.dumps({'result':'unavailable_username'}))
	except:
		pass
	if pwd1!=pwd2:
		return HttpResponse(simplejson.dumps({'result':'mismatched_passwords'}))
	request.session['iflog'] = True
	user=User.objects.create(name = name1,
							password = pwd1,
							date = time.strftime("%Y-%m-%d %X", time.localtime()),
							recentdate = time.strftime("%Y-%m-%d %X", time.localtime())
							)
	request.session['username'] = name1
	return HttpResponse(simplejson.dumps({'result':'ok'}))
	
def worldline(request):
	try:
		name1 = request.session['username']
	except:
		return render_to_response('index.html',locals())
	try:
		xinshou = request.GET['new']
		if xinshou == "intro":
			return render_to_response('test.html',locals())
	except:
		pass
	ideas = Idea.objects.filter(name__name=name1).order_by('date')
	text1 = []
	line1 = ["100","150"]
	year1 = []
	month1 = []
	numb1 = []
	secs = []
	for x in ideas:
		if (str(x.date)[5:7]+'.'+str(x.date)[8:10] in month1)and(str(x.date)[0:4] in year1):
			numb1[-1] += '.'
			text1[len(text1)-1].append(x.text)
			continue
		text1.append([x.text])
		numb1.append('.')
		secs.append(time.mktime(time.strptime(str(x.date),"%Y-%m-%d %H:%M:%S")))
		year1.append(str(x.date)[0:4])
		month1.append(str(x.date)[5:7]+'.'+str(x.date)[8:10])
	for x in range(1,len(month1)):		
		line1.append(int(line1[-1])+(int(secs[x])-int(secs[x-1]))/800)
	if len(month1)!=1:
		line1 = line1[1:]
	return render_to_response('worldline.html',locals())
	
def add(request):
	try:
		text1 = request.GET['text']
		name1 = request.session['username']
	except:
		return render_to_response('index.html',locals())
	user = User.objects.get(name=name1)
	idea = Idea.objects.create(name = user,
							text = text1,
							date = time.strftime("%Y-%m-%d %X", time.localtime())
							)
	return HttpResponse(simplejson.dumps({'result':'ok'}))
	
def delcontext(request):
	try:
		numb = request.GET['numb']
		name1 = request.session['username']
	except:
		return render_to_response('index.html',locals())
	ideas = Idea.objects.filter(name__name=name1).order_by('date')
	ideas[int(numb)].delete()
	return HttpResponse(simplejson.dumps({'result':'ok'}))
	
def about(request):
	return render_to_response('about.html',locals())
	
def privacy(request):
	return render_to_response('privacy.html',locals())
	
def questions(request):
	return render_to_response('questions.html',locals())
	
def logout(request):
	request.session['iflog'] = False
	return render_to_response('index.html',locals())