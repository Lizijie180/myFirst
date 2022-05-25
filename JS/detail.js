/*
 * @Author: lzj
 * @Date: 2022-05-19 22:21:59
 */
// 商品详情页面

//判断是否从列表页跳转过来的--通过goodsId值
const goodsId = localStorage.getItem('goodsId');
if (!goodsId) {
    location.href = './list.html'
}

//根据id获取商品信息
getInfo();
function getInfo() {
    $.get('http://localhost:8888/goods/item', { id: goodsId }, res => {
        console.log(res);
        $('.show>img').prop('src', res.info.img_big_logo);
        $('.info>.title').html(res.info.title);
        $('.info>.price').html(res.info.price);
    })
}

$('button').on('click', function (e) {
    //验证登录
    //获取localStorage内的凭证
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!id || !token) {
        alert('你还没有登录，请在登录后进行添加操作');
        return
    }

    //发送请求到购物车
    $.ajax({
        url: 'http://localhost:8888/cart/add',
        type: 'post',
        data: { id: id, goodsId: goodsId },
        headers: {
            authorization: token
        },
        success: res => {
            console.log(res);
            if (res.code != 1) {
                alert('请在登录后进行操作')
                return
            } else {
                alert('加入成功');
            }
        }

    })
})