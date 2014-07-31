import re

class IgnoreCrsfMiddleware(object):
	def process_request(self,request, **karg):
		if re.match(r'^/login/?$',request.path):
			request.csrf_processing_done = True
			return None
			
		if re.match(r'^/register/?$',request.path):
			request.csrf_processing_done = True
			return None