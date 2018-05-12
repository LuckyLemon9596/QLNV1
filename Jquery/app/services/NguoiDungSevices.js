function NguoiDungServices()
{
    this.LayThongTinGiaoVu = function ()
    {
        var urlAPI = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachNguoiDung";
        return $.ajax({
            type:"GET",
            dataType:"json",
            url: urlAPI,
        })
    }
}