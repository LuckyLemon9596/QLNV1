$(document).ready(function(){
    //khởi tạo đối tượng danhSachKhoaHoc
    var danhSachKhoaHoc = new DanhSachKhoaHoc();
    //Khởi tạo đối tượng khoaHocService
    var khoaHocService = new KhoaHocServices();
    //Khởi tạo đối tượng người dùng service
    var nguoiDungService = new NguoiDungServices();

    LoadDanhSachKhoaHoc();

    function LoadDanhSachKhoaHoc(){
        khoaHocService.LayDanhSachKhoaHoc()
        .done(function(DSKH){
            console.log(DSKH);
            //Load khóa học lên data table
            danhSachKhoaHoc.DSKH = DSKH;
            LoadTableDanhSachKhoaHoc(danhSachKhoaHoc.DSKH);
        })
        .fail(function(error){
            console.log(error);
        })
        //Load nội dung thẻ select trong poup
        LayDanhSachGiaoVu();

    }

    /**Lấy danh sách Giáo vụ */
    function LayDanhSachGiaoVu(){
        nguoiDungService.LayThongTinGiaoVu()
        .done(function(DSND){
            var noiDung = "";
            //Load danh sách người dùng lên thẻ select
            for(var i = 0; i < DSND.length; i++){
                var nguoiDung = DSND[i];
                //Chỉ lấy những người là Giáo Vụ
                if(nguoiDung.MaLoaiNguoiDung === "GV"){
                    noiDung += `
                    <option value="${nguoiDung.TaiKhoan}">${nguoiDung.HoTen}</option>
                `;
                }
            }
            $("#NguoiTao").html(noiDung);
        })
        .fail(function(error){
            console.log(error);
        })
    }

    /*Loadtable danhSachKhoaHoc*/
    function LoadTableDanhSachKhoaHoc(DSKH)
    {
        var noiDung = '';
        for (var i = 0; i < DSKH.length; i++){
            var khoaHoc = DSKH[i];
            noiDung += `
                <tr class="trKhoaHoc">
                    <td><input type="checkbox" class="ckbMaKhoaHoc" value=${khoaHoc.MaKhoaHoc}""></td>
                    <td class="MaKhoaHoc">${khoaHoc.MaKhoaHoc}</td>
                    <td class="TenKhoaHoc">${khoaHoc.TenKhoaHoc}</td>
                    <td class="MoTa" style="min-width:50px; height:200px;">${khoaHoc.MoTa}</td>
                    <td class="LuotXem">${khoaHoc.LuotXem}</td>
                    <td class="HinhAnh"><img src="${khoaHoc.HinhAnh}" width="100" height="100"></td>
                    <td class="NguoiTao">${khoaHoc.NguoiTao}</td>
                    <td><button class="btn btn-primary btnChinhSua" MaKhoaHoc="${khoaHoc.MaKhoaHoc}">Chỉnh sửa</button></td>
                    <td><button class="btn btn-danger btnXoaKhoaHoc" MaKhoaHoc="${khoaHoc.MaKhoaHoc}">Xóa</button></td>
                </tr>
            `;
        }
        $("#tblDanhSachKhoaHoc").html(noiDung);
    }


    /**Load ngược lên poup chỉnh sửa */
    $("body").delegate(".btnChinhSua","click", function(){
        //khóa input MaKhoaHoc
        $("#MaKhoaHoc").attr("readonly", true);
        //Clear dữ liệu textbox.txtF
        $(".txtF").val("");
        //Tạo phần nội dung modal Title
        var modalTitle = "Chỉnh sửa khóa học";
        //Tạo nội dung cho modal footer: Dùng string tamplate
        var modalFooter = `
            <button id="btnLuu" class="btn btn-success">Lưu</button>
            <button id="btnDong" class="btn btn-danger">Đóng</button>
        `;
        $(".modal-title").html(modalTitle);
        $(".modal-footer").html(modalFooter);

        //Load phần nội dung chỉnh sửa lên poup
        var trKhoaHoc = $(this).closest(".trKhoaHoc");
        var MaKhoaHoc = trKhoaHoc.find(".MaKhoaHoc").html().trim();
        var TenKhoaHoc = trKhoaHoc.find(".TenKhoaHoc").html().trim();
        var MoTa = trKhoaHoc.find(".MoTa").html().trim();
        var LuotXem = trKhoaHoc.find(".LuotXem").html().trim();
        var HinhAnh = trKhoaHoc.find(".HinhAnh").find("img").attr("src");
        // var HinhAnh = trKhoaHoc.find("img").attr("src");//cách 2 vì ta chỉ có 1 img trong tr
        var NguoiTao = trKhoaHoc.find(".NguoiTao").html().trim();

        $("#MaKhoaHoc").val(MaKhoaHoc);
        $("#TenKhoaHoc").val(TenKhoaHoc);
        // $("#MoTa").val(MoTa);
        $("#LuotXem").val(LuotXem);
        $("#HinhAnh").val(HinhAnh);
        $("#NguoiTao").val(NguoiTao);

        //Dùng cú pháp để gán nội dung cho ckeditor
        CKEDITOR.instances["MoTa"].setData(MoTa);

        //Gọi nút open popupmodal
        $("#btnPopupModal").trigger("click");

    })

    /**Lưu cập nhật khóa học */
    $("body").delegate("#btnLuu", "click", function(){
        //Lấy thông tin người dùng cập nhật
        var MaKhoaHoc = $("#MaKhoaHoc").val();
        var TenKhoaHoc = $("#TenKhoaHoc").val();
        var MoTa = CKEDITOR.instances["MoTa"].getData();//Lấy giá trị từ editor
        var LuotXem = $("#LuotXem").val();
        var HinhAnh = $("#HinhAnh").val();
        var NguoiTao = $("#NguoiTao").val();

        //Fill vào đối tượng
        var khoaHoc = new KhoaHoc(MaKhoaHoc, TenKhoaHoc, MoTa, LuotXem, HinhAnh, NguoiTao);

        khoaHocService.CapNhatKhoaHoc(khoaHoc)
        .done(function(result){
            console.log(result);
            window.location.reload();
        })
        .fail(function(error){
            console.log(error);
        });
        
        //Sau khi lưu Mở khóa input MaKhoaHoc
        $("#MaKhoaHoc").attr("readonly", false);
    });


    /*Dom đến button thêm khóa học*/
    $("#btnThemKhoaHoc").click(OpenPoupModal);
    //Xử lý cho sự kiện click đó
    function OpenPoupModal(){
        //clear dữ liệu textbox.txtF
        $(".txtF").val("");
        //Tạo phần nội dung modal title
        var modalTitle = "Thêm Khóa Học";
        //Tạo nội dung cho modal footers: Dùng string template
        var modalFooter = `
            <button id="btnTaoMoi" class="btn btn-success">Tạo mới </button>
            <button id="btnDong" class="btn btn-danger">Đóng </button>
        `;

        $(".modal-title").html(modalTitle);
        $(".modal-footer").html(modalFooter);
        //Gọi nút Openmodal
        $("#btnPopupModal").trigger("click");
    }

    /*Thêm mới khóa học */
    $("body").delegate("#btnTaoMoi","click", function(){
        //Lấy thông tin người dùng nhập vào
        var maKH = $("#MaKhoaHoc").val();
        var tenKH = $("#TenKhoaHoc").val();
        var moTa = $("#MoTa").val();
        var luotXem = $("#LuotXem").val();
        var hinhAnh = $("#HinhAnh").val();
        var nguoiTao = $("#NguoiTao").val();
        //Khởi tạo đối tượng khoaHoc
        var khoaHoc = new KhoaHoc(maKH, tenKH, moTa, luotXem, hinhAnh, nguoiTao);
        //Gọi services để đẩy dữ liệu lên server
        khoaHocService.ThemKhoaHoc(khoaHoc)
        .done(function(result){
            console.log(result);
            window.location.reload();
        })
        .fail(function(error){
            console.log(error);
        });


    })


    /**Xóa khóa học */
    $("body").delegate(".btnXoaKhoaHoc","click",function(){
        var id = $(this).attr("MaKhoaHoc");
        khoaHocService.XoaKhoaHoc(id)
        .done(function(result){
            console.log(result);
            alert("Xóa thành công!");
            window.location.reload();
        })
        .fail(function(error){
            console.log(error);
            alert("Xóa không thành công!");
        });

    })


    //Dùng id
    CKEDITOR.replace('MoTa',{
        allowedContent: 'iframe[*]'
    } );
    // CKEDITOR.replace( 'MoTa' );//Dung name
})