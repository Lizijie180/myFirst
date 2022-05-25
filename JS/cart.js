/*
 * @Author: lzj
 * @Date: 2022-05-19 23:03:18
 */
// 购物车页面
//获取localStorage内的凭证
const token = localStorage.getItem('token');
const id = localStorage.getItem('id');

//判断是否已经登录
if (!id || !token) {
    location.href = './login.html';
} else {
    //请求数据
    getCart();
}

//请求数据
function getCart() {
    $.ajax({
        'url': 'http://localhost:8888/cart/list',
        'type': 'get',
        'data': { id: id },
        headers: {
            authorization: token
        },
        success: function (res) {
            if (res.code != 1) {
                location.href = './login.html';
                return
            } else {
                // console.log(res);
                appHTML(res);
            }
        }
    })
}


//渲染页面
function appHTML(res) {
    if (!res.cart.length) {
        $('.empty').addClass('active');
        $('.list').removeClass('active');
    } else {

        // 声明变量
        let selectNum = 0;  //选中商品的数量
        let totalPrice = 0;  //该商品的总价
        let totalNum = 0;   //该商品加入购物车的数量

        res.cart.forEach(ele => {
            if (ele.is_select) {
                selectNum++;
                totalNum += ele.cart_number;
                totalPrice += ele.current_price * ele.cart_number;
            }
        });

        //判断是否所有都选中
        let str = `<div class="top">
                        全选<input type="checkbox" name="" id="" ${selectNum == res.cart.length ? 'checked' : ''}>
                     </div>
                    <ul class="middle">`;

        res.cart.forEach(ele => {
            str += `<li class="liA" goodsId="${ele.goods_id}">
            <div class="select">
                <input type="checkbox" name="" id="" ${ele.is_select == true ? 'checked' : ''}>
            </div>
            <div class="show">
                <img src="${ele.img_small_logo}" alt="">
            </div>
            <div class="title">
                ${ele.title}
            </div>
            <div class="price">￥${ele.current_price}</div>
            <div class="number">
                <button class="down">-</button>
                <input type="text" value="${ele.cart_number}" name="" id="">
                <button class="up">+</button>
            </div>
            <div class="subPrice">￥${(ele.current_price * ele.cart_number).toFixed(2)}</div>
            <div class="destory">
                <button class="del">删除</button>
            </div>
        </li>`
        });

        str += `</ul>
        <div class="bottom">
            <p>
                共计：<span>${totalNum}</span>件商品
            </p>
            <div class="btns">
                <button class="delAll">清空购物车</button>
                <button class="delSel" ${selectNum == 0 ? 'disabled' : ''}>删除所有</button>
                <button class="goPay" ${selectNum == 0 ? 'disabled' : ''}> 去支付</button >
            </div >
            <p>
                共计：￥<span>${totalPrice.toFixed(2)}</span>
            </p>
        </div > `
        //追加到页面中
        $('.list').html(str);
    }
}

//各种点击效果
//复选按钮的点击事件
$('.list').on('click', '.middle .select input', function () {

    //请求修改选中状态
    $.ajax({
        'url': 'http://localhost:8888/cart/select',
        'type': 'post',
        'data': { id: id, goodsId: $(this).parent().parent().attr('goodsId') },
        headers: {
            authorization: token
        },
        success: res => {
            getCart();
        }
    })
})

//全选按钮的事件
$('.list').on('click', ' .top input', function () {
    let type = 0;
    //如果选中
    if ($(this)[0].checked == true) {
        type = 1;
    } else {
        type = 0;
    }

    //请求修改选中状态
    $.ajax({
        'url': 'http://localhost:8888/cart/select/all',
        'type': 'post',
        'data': { id: id, type: type },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})

//删除购物车中的一条商品
$('.list').on('click', '.del', function () {

    //发送请求
    $.ajax({
        'url': 'http://localhost:8888/cart/remove',
        'type': 'get',
        'data': { id: id, goodsId: $(this).parent().parent().attr('goodsId') },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})

//删除所有已选中
$('.list').on('click', '.delSel', function () {

    //发送请求
    $.ajax({
        'url': 'http://localhost:8888/cart/remove/select',
        'type': 'get',
        'data': { id: id },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})

//清空购物车
$('.list').on('click', '.delAll', function () {

    //发送请求
    $.ajax({
        'url': 'http://localhost:8888/cart/clear',
        'type': 'get',
        'data': { id: id },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})

//修改购买的数量 +  - 
$('.list').on('click', ' .number button', function () {
    let nowNum = 0;
    //判断是加还是减，如果是减 判断是否小于1
    if ($(this).prop('class') == 'up') {
        nowNum = $(this).prev().val();
        nowNum++;
    } else if ($(this).prop('class') == 'down') {
        nowNum = $(this).next().val();
        if (nowNum == 1) {
            return
        } else {
            nowNum--;
        }
    }

    //发送请求
    $.ajax({
        'url': 'http://localhost:8888/cart/number',
        'type': 'post',
        'data': { id: id, goodsId: $(this).parent().parent().attr('goodsId'), number: nowNum },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})

//手动修改数量
$('.list').on('change', '.number input', function () {
    let nowNum = $(this).val();
    // console.log(nowNum);
    //发送请求
    $.ajax({
        'url': 'http://localhost:8888/cart/number',
        'type': 'post',
        'data': { id: id, goodsId: $(this).parent().parent().attr('goodsId'), number: nowNum },
        headers: {
            authorization: token
        },
        success: res => {
            // console.log(res);
            getCart();
        }
    })
})