import os
import ckanapi
import requests


class OpanAfricaUploader(object):
  def __init__(self, api_key):
    self.data_portal = 'https://africaopendata.org'
    # upload api
    self.api_url = self.data_portal + '/api/action/resource_create'
    self.APIKEY = api_key
    self.ckan = ckanapi.RemoteCKAN(self.data_portal, apikey=self.APIKEY)

  def create_package(self, url, title):
    package_name = url
    package_title = title
    try:
        print ('Creating "{package_title}" package'.format(**locals()))
        self.package = self.ckan.action.package_create(name=package_name,
                                            title=package_title,
                                            owner_org = 'water-and-sanitation-corporation-ltd-wasac')
    except (ckanapi.ValidationError) as e:
        if (e.error_dict['__type'] == 'Validation Error' and
          e.error_dict['name'] == ['That URL is already in use.']):
            print ('"{package_title}" package already exists'.format(**locals()))
            self.package = self.ckan.action.package_show(id=package_name)
        else:
            raise

  def upload_datasets(self, path, description):
    filename = os.path.basename(path)
    extension = os.path.splitext(filename)[1][1:].lower()
    
    print ('Creating "{filename}"'.format(**locals()))
    r = requests.post(self.api_url,
                      data={'package_id': self.package['id'],
                            'name': filename,
                            'format': extension,
                            'description': description
                            },
                      headers={'Authorization': self.APIKEY},
                      files=[('upload', open(path, 'rb'))])

    if r.status_code != 200:
        print ('Error while creating resource: {0}'.format(r.content))
    print ('Uploaded "{filename}" successfully'.format(**locals()))
