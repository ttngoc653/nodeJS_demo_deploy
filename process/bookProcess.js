var db = require('../other/cnt_mysql');

exports.loadAll = function() {
    var sql = `SELECT customer.name 'customer_name', customer.phone 'customer_phone',
BookCar.address 'welcome_address', BookCar.note, BookCar.seats, DATE_FORMAT(BookCar.time, '%Y-%m-%d %H:%i:%s') 'time_request',
g1.latitude 'geocoding_lat', g1.longitude 'geocoding_lon',
g2.latitude 'reverse_geocoding_lat', g2.longitude 'reverse_geocoding_lon'
FROM BookCar INNER JOIN customer ON BookCar.customer = customer.id
LEFT JOIN geocode g1 ON BookCar.geocodin = g1.id
LEFT JOIN geocode g2 ON BookCar.regeocoding = g2.id
LEFT JOIN user ON BookCar.biker = user.id`;
	return db.load(sql);
}

exports.loadRequestASC=function(){
	var sql="SELECT * from BookCar order by time asc";
	return db.load(sql);
};

function geocodingId(lati, longi) {
	console.log("Location: "+lati + " " + longi);
	db.load(`SELECT id FROM geocode WHERE latitude LIKE '${lati}' AND longitude LIKE '${longi}'`, (err, rows) => {
		if(rows.length == 1) return rows[0].id;
		else {
			db.write(`INSERT INTO geocode (latitude, longitude) VALUES ('${lati}', '${longi}')`, (err, value) => {
				return value.insertId;
			});
		}
	});
}

exports.bookCar = function(name, phone, address, note, seat, time_book) {
	let sql = `SELECT id, name, phone FROM customer WHERE MD5(phone) like MD5('${phone}')`;

	return db.load(sql)
	.then(rows => {
		if(rows.length == 0){
			return db.write(`INSERT INTO customer (name, phone) VALUES ('${name}', '${phone}')`);
		}
		else if(rows.length == 1 && rows[0].name != name){
			db.write(`UPDATE customer SET name = '${name}' WHERE phone = '${phone}')`);
			return rows[0].id;
		}
		else if(rows.length == 1){
			return rows[0].id;
		}
	})
	.then(id_customer => {
		if(typeof id_customer === 'object')
			id_customer = id_customer.insertId;

		sql = `INSERT INTO BookCar(customer, address, note, status, seats, time) VALUES 
			('${id_customer}', 
			'${address}', 
			'${note}', 
			'chưa được định vị', 
			'${seat}', 
			'${time_book}')`;
		return db.write(sql);
	})
	.catch(err => {
		console.log(err);
		throw err;
	});
}

exports.getDateCurrent = function() {
	var current = new Date();
	return `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
}

exports.set2GeoCoding = function(geocoding_id, phone_customer, date_book) {
	var sql = `UPDATE BookCar 
			SET geocodin = '${geocoding_id}', regeocoding = '${geocoding_id}' 
			WHERE customer IN (SELECT id FROM customer WHERE phone = '${phone_customer}') 
			AND time = '${date_book}'`;
	return db.write(sql);
}

exports.getAll = function() {
	var sql = `SELECT customer.name 'customer_name', customer.phone 'customer_phone', address, note, g1.latitude 'geo_lat', g1.longitude 'geo_lon',
	 g2.latitude 're_geo_lat', g2.longitude 're_geo_lon', biker, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') 'time', BookCar.status, seats 
FROM BookCar JOIN geocode g1 ON BookCar.geocodin = g1.id
JOIN geocode g2 ON BookCar.regeocoding = g2.id
JOIN customer ON BookCar.customer = customer.id
LEFT JOIN user ON user.id = BookCar.biker`;
	return db.load(sql);
}

exports.getRequestFromPhone = function(phone_customer) {
	var sql = `SELECT customer.name 'customer_name', customer.phone 'customer_phone', address, note, g1.latitude 'geo_lat', g1.longitude 'geo_lon', 
	g2.latitude 're_geo_lat', g2.longitude 're_geo_lon', biker, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') 'time', BookCar.status, seats 
FROM BookCar JOIN geocode g1 ON BookCar.geocodin = g1.id
JOIN geocode g2 ON BookCar.regeocoding = g2.id
JOIN customer ON BookCar.customer = customer.id
LEFT JOIN user ON user.id = BookCar.biker where customer.phone = '${phone_customer}'` ;
	return db.load(sql);
}

exports.changeStatus = function(phone_of_customer, time_sent_request, status_wish_change) {
	var sql = `UPDATE BookCar 
SET status = '${status_wish_change}' 
WHERE customer IN (SELECT c.id FROM customer c WHERE c.phone LIKE '${phone_of_customer}') 
AND time like '${time_sent_request}';`;
	return db.write(sql);
}

exports.changeStatusAndUpToReject = function(phone_of_customer, time_sent_request, status_wish_change) {
	var sql = `UPDATE BookCar 
SET status = '${status_wish_change}', 
times_reject = times_reject + 1
WHERE customer IN (SELECT c.id FROM customer c WHERE c.phone LIKE '${phone_of_customer}') 
AND time like '${time_sent_request}';`;
	return db.write(sql);
}

exports.setDriver = function(phone_of_customer, time_sent_request, driver_id, time_accept = this.getDateCurrent()) {
	var sql = `UPDATE BookCar
SET biker = '${driver_id}', time_driver_accept = '${time_accept}' 
WHERE customer IN (SELECT id FROM customer WHERE phone LIKE '${phone_of_customer}')
AND time like '${time_sent_request}';`;
	return db.write(sql);
}