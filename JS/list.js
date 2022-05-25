/*
 * @Author: lzj
 * @Date: 2022-05-19 16:21:18
 */
// 商品列表页
//请求分类列表
getUl();
function getUl() {
    $.ajax({
        type: 'get',
        url: 'http://localhost:8888/goods/category',
        data: {},
        success: function (res) {
            let str = '<li class="active">全部</li>';
            res.list.forEach((ele) => {
                str += `<li>${ele}</li>`
            });
            $('.ul1').html(str);
        }
    })
}

//请求商品列表
const info = {
    current: 1,   //当前页
    pagesize: 12,    //一页显示多少
    serch: '',     //搜索
    filter: '',    //筛选
    saleType: 10,   //折扣
    sortType: 'id',   //排序
    sortMethod: 'ASC',   //正序倒序
    category: ''     //分类
}

//设置现在页数属性
let nomTotal = 0;

//商品列表
getGoods();
function getGoods() {
    $.ajax({
        type: 'get',
        url: 'http://localhost:8888/goods/list',
        data: info,
        success: res => {
            nomTotal = res.total;
            //如果是第一页，就不让往左翻页
            if (info.current == 1) {
                $('.left').addClass('disable');
            } else {
                $('.left').removeClass('disable');
            }

            //如果是最后一页，不让往右翻页
            if (info.current == res.total) {
                $('.right').addClass('disable');
            } else {
                $('.right').removeClass('disable');
            }

            //渲染统计页数的位置
            $('.total').html(`${info.current} / ${res.total}`);

            //渲染一页显示多少条
            $('select').val(info.pagesize);

            //渲染当前页数
            $('.page').val(info.current);

            //渲染商品列表
            let str = '';
            res.list.forEach((ele) => {
                str += `<li goodsId="${ele.goods_id}">
                <div class="show">
                    <img src="${ele.img_big_logo}" alt="">
                    ${ele.is_hot ? '<div class="hot">hot</div>' : ''}
                    ${ele.is_sale ? '<div class="sale">sale</div>' : ''}
                </div>
                <div class="info">
                    <p class="title">${ele.title}</p>
                    <p class="price">
                        <span class="current">￥${ele.current_price}</span>
                    <span class="old">￥${ele.price}</span>
                    </p >
                    <button goodsId="${ele.goods_id}">加入购物车</button>
                </div >
            </li > `
            })
            $('.list').html(str);
        }
    })

}

//声明各种事件

//分类的点击事件---使用事件委托
$('.ul1').on('click', 'li', function () {
    //切换类名
    // console.log(this);   //事件源
    $(this).addClass('active').siblings().removeClass('active');

    //修改info的数据
    info.category = $(this).html() === '全部' ? '' : $(this).html();
    info.current = 1;
    //重新请求数据
    getGoods();
})

//筛选的点击事件---使用事件委托
$('.ul2').on('click', 'li', function () {
    //切换类名
    // console.log(this);   //事件源
    $(this).addClass('active').siblings().removeClass('active');

    //修改info的数据--可以通过自定义属性获取
    if ($(this).html() == '折扣') {
        info.filter = 'sale';
    } else if ($(this).html() == '热销') {
        info.filter = 'hot';
    } else {
        info.filter = '';
    }
    info.current = 1;
    //重新请求数据
    getGoods();
})

//折扣的点击事件---使用事件委托
$('.ul3').on('click', 'li', function () {
    //切换类名
    // console.log(this);   //事件源
    $(this).addClass('active').siblings().removeClass('active');

    //修改info的数据
    info.saleType = $(this).html() == '全部' ? '10' : $(this).html();
    info.current = 1;
    //重新请求数据
    getGoods();
})

//排序的点击事件---使用事件委托
$('.ul4').on('click', 'li', function () {
    //切换类名
    // console.log(this);   //事件源
    $(this).addClass('active').siblings().removeClass('active');

    //修改info的数据
    info.sortType = $(this).attr('type');
    info.sortMethod = $(this).attr('method');
    //重新请求数据
    getGoods();
})

//搜索的输入事件
$('.serch').on('input', function () {

    //修改info的serch的值
    info.search = $('.serch').val().trim();
    info.current = 1;
    //重新请求数据
    getGoods();
})

//分页的点击事件
$('.left').on('click', function () {
    // console.log(1);
    if ($(this).hasClass('disable')) {
        return;
    } else {
        info.current--;
    }
    //重新请求数据
    getGoods();
})

$('.right').on('click', function () {
    // console.log(1);
    if ($(this).hasClass('disable')) {
        return;
    } else {
        info.current++;
    }
    //重新请求数据
    getGoods();
})

//设置一页显示多少数据
//当select变化时触发
$('select').on('change', function () {
    info.pagesize = $('select').val();
    //重新请求数据
    getGoods();
})

//点击跳转事件
$('.go').on('click', function () {
    let goPage = Math.floor($(this).prev().val().trim());
    if (goPage > 0 && goPage <= nomTotal) {
        info.current = goPage;
    } else {
        info.current = 1
    }
    //重新请求数据
    getGoods();
})

//加入购物车
// 事件委托 每个按钮 委托到整个li
$('.list').on('click', 'button', function (e) {
    //阻止事件冒泡
    e.stopPropagation();
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
        data: { id: id, goodsId: $(this).attr('goodsId') },
        headers: {
            authorization: token
        },
        success: res => {
            if (res.code != 1) {
                alert('请在登录后进行操作')
                return
            } else {
                alert('加入成功');
            }
        }

    })
})


//切换详情页面
$('.list').on('click', 'li', function () {
    //获取商品id，存储在localStorage内
    localStorage.setItem('goodsId', $(this).attr('goodsId'));

    //跳转到详情页面
    location.href = './detail.html'
})