import numpy as np
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
from datetime import datetime
# miller projection

def Datapoint(self,test):
	return "Hello"


map = Basemap(projection='merc',llcrnrlat=-80,urcrnrlat=80,\
            llcrnrlon=-180,urcrnrlon=180,lat_ts=20,resolution='c')
# plot coastlines, draw label meridians and parallels.
map.drawcoastlines()
map.drawparallels(np.arange(-90,90,30),labels=[1,0,0,0])
map.drawmeridians(np.arange(map.lonmin,map.lonmax+30,60),labels=[0,0,0,1])
# fill continents 'coral' (with zorder=0), color wet areas 'aqua'
map.drawmapboundary(fill_color='blue')
map.fillcontinents(color='green',lake_color='blue')
# shade the night areas, with alpha transparency so the
# map shows through. Use current time in UTC.

with open("ip_coordinates.txt") as f:
	for line in f:
		points = line.split(",")
		lat = float(points[1])
		lng = float(points[0])
		x,y = map(lat,lng)
		point = map.plot(x,y,'ro',markersize=5)
		# plt.annotate(line,(x,y))


date = datetime.now()
plt.title('Current Assailant Map for %s' % date.strftime("%d %b %Y %H:%M:%S"))
plt.show()

# m = Basemap(width=12000000,height=9000000,projection='lcc',
#             resolution=None,lat_1=45.,lat_2=55,lat_0=50,lon_0=-107.)
# m.shadedrelief()
# plt.show()