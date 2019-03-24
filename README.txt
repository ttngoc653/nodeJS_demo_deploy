Links API:
/u/login
	- Input: JSON
	u: email or phonenumber
	p: password
	- Output: 
	if(input false)
		return message:Don't found user
	error: return error

/u/signin
	- Input: JSON
	u_name:
	u_phone:
	u_seat: (default 0)
	u_mail:
	u_pass: (password)
	u_role: (default -1)
	- Output:
	if(success)
		return message: Create account successfully!
	else if (error)
		return status(500) vs err
/b/bookcar
	- Input: JSON
	"b_name":"Khách hàng 1",
	"b_phone":"0382589632",
	"b_address":" 227 nvcu q5 / dhkhtn",
	"b_note":"rước ở trước chỗ bán sách",
	"b_seat":2 // số người cần đưa đi
	- Output:
	if(success) 
		return  message: Added successfully!
	else if(error)
		return status(500) + string(err)

/b/
	- Input: NULL
	- Output: JSON type list have columns
	customer_name, customer_phone, address, note,
	geo_lat, geo_lon, re_geo_lat, re_geo_lon,
	biker, time, status, seats