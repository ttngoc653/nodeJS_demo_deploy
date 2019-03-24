var db = require('../other/cnt_mysql'),
map = require('../other/google_maps');

exports.getListBookedCarInStatuLocated = function() {
	let sql = `SELECT customer.name 'customer_name', customer.phone 'customer_phone', 
BookCar.address 'welcome_address', BookCar.note, BookCar.status, BookCar.seats, DATE_FORMAT(BookCar.time, '%Y-%m-%d %H:%i:%s') 'time_request', 
g1.latitude 'geocoding_lat', g1.longitude 'geocoding_lon', BookCar.times_reject 
FROM BookCar INNER JOIN customer ON BookCar.customer = customer.id 
LEFT JOIN geocode g1 ON BookCar.geocodin = g1.id 
LEFT JOIN geocode g2 ON BookCar.regeocoding = g2.id 
LEFT JOIN user ON BookCar.biker = user.id
WHERE BookCar.status LIKE N'Đã được định vị';`;
	return db.load(sql);
}

exports.distance = function(from, to) {
	return map.calculatorDistance(from, to);
}

exports.distance1 = function(fromlat, fromLon, toLat, toLon) {
	return map.calculatorDistance1(fromlat, fromLon, toLat, toLon);
}

exports.updateLocationCurrent = function(id_user, latitude, longitude) {
	let sql = `UPDATE user 
SET latitude = '${ latitude }', 
longitude = '${ longitude }' 
WHERE id =  '${ id_user }'`;
	return db.write(sql);
}

exports.getBookCar = function(phone, time_book) {
	let sql = `SELECT customer.name 'customer_name', customer.phone 'customer_phone', 
BookCar.address 'welcome_address', BookCar.note, BookCar.status, BookCar.seats, DATE_FORMAT(BookCar.time, '%Y-%m-%d %H:%i:%s') 'time_request', 
g1.latitude 'geocoding_lat', g1.longitude 'geocoding_lon'
FROM BookCar INNER JOIN customer ON BookCar.customer = customer.id 
LEFT JOIN geocode g1 ON BookCar.geocodin = g1.id 
LEFT JOIN geocode g2 ON BookCar.regeocoding = g2.id 
LEFT JOIN user ON BookCar.biker = user.id
WHERE customer.phone LIKE '${phone}'
AND BookCar.time = '${ time_book }';`;
	return db.load(sql);
}

exports.upNumberSentRequestToDriver = function(phone, time_book) {
	let sql = `UPDATE BookCar 
SET number_request_sent = number_request_sent + 1 
WHERE time = '${time_book}' 
	AND customer IN (SELECT id FROM customer WHERE phone like '${phone}';`;
	return db.write(sql);
}