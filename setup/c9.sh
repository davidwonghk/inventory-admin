dpkg-divert --local --rename --add /sbin/initctl
ln -s /bin/true /sbin/initctl
dpkg-divert --local --rename --add /etc/init.d/mongod
ln -s /bin/true /etc/init.d/mongod

apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo 'deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse' > /etc/apt/sources.list.d/mongodb.list 
apt-get update 
apt-get install -yq mongodb-org
