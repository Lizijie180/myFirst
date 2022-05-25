/*
 * @Author: lzj
 * @Date: 2022-05-17 22:48:25
 */
//首页
// console.log(localStorage.getItem('id'));
// console.log(localStorage.getItem('token'));

//获取localStorage内的凭证
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

//判断是否已经登录
if (!id || !token) {
    $('.off').addClass('active');
    $('.on').removeClass('active');
} else {
    $.ajax({
        'url': 'http://localhost:8888/users/info/',
        'type': 'get',
        'data': { id: id },
        headers: {
            authorization: token
        },
        success: function (res) {
            if (res.code == 0) {
                $('.off').addClass('active');
                $('.on').removeClass('active');
            } else if (res.code == 1) {
                //让请登录隐藏，显示昵称、个人中心等
                $('.on').addClass('active');
                $('.off').removeClass('active');
                //修改昵称----res.info.nickname  昵称
                $('.on span').first().html(res.info.nickname);
            }
        }
    })
}

//个人中心
$('.self').on({
    'click': function () {
        location.href = './self.html';
    }
})

//退出登录
$('.logout').on({
    'click': function () {
        //发送请求
        $.ajax({
            'url': 'http://localhost:8888/users/logout/',
            'type': 'get',
            'data': { id: id },
            headers: {
                authorization: token
            },
            success: function (res) {
                location.reload();
            }
        })
    }
})
