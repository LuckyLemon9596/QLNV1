function KhoaHocServices(){
    this.LayDanhSachKhoaHoc = function(){
        var urlAPI = "http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachKhoaHoc";
        return $.ajax({
            type:"GET",
            dataType:"json",
            url: urlAPI,
        })

    }
    this.ThemKhoaHoc = function(khoaHoc){
        var urlAPI = "http://sv.myclass.vn/api/QuanLyTrungTam/ThemKhoaHoc";
        return $.ajax({
            type:"POST",
            dataType:"json",
            url: urlAPI,
            data:khoaHoc,
        })
    }
    this.CapNhatKhoaHoc = function(khoaHoc){
        var urlAPI = "http://sv.myclass.vn/api/QuanLyTrungTam/CapNhatKhoaHoc";
        var jsonKhoaHoc = JSON.stringify(khoaHoc);
        return $.ajax({
            type:"PUT",
            url: urlAPI,
            contentType: "application/json",
            dataType: "json",
            data: jsonKhoaHoc,
        })
    }

    this.XoaKhoaHoc = function(id){
        var urlAPI = `http://sv.myclass.vn/api/QuanLyTrungTam/XoaKhoaHoc/${id}`;
        return $.ajax({
            type:"DELETE",
            url: urlAPI
        })
    }

}