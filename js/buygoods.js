$(function(){
	var cartHandler = {
		//购物车数据
		cart:{},
		//付款数据
		payCart:{},
		fn:null,
		//初始化
		init:function(){
			this.handleData();
			this.handleInput();
			this.decreaseClick();
			this.increaseClick();
			this.delete();
			this.checkboxSelect();
			this.selectAll();
		},
		//处理购物车数据，拼接字符串，放到页面上
		handleData:function(){
			this.readCart();
			var cartStr = "";
			var popStr = '';
			for(var key in this.cart){
				var obj = this.cart[key];
				for(var key2 in obj.gcolor){
					var goods = obj.gcolor[key2];
					var col = parseInt(obj.price)*goods.amount;
					console.log(col)
					cartStr += '<div class="item-box" data-id="'+key+'">'+'<div class="item-table" id="J_cartGoods">'
							+	'<div class="item-row clearfix" data-gd="'+key2+'">'
							+	'<div class="col col-check">'
							+	'<input class="iconfont icon-checkbox icon-check  J_itemCheckbox" type="checkbox">'
							+	'</div>'
							+	'<div class="col col-img" >'
							+	'<a href="shopcart.html" target="_blank">'
							+	'<img src="'+goods.img+'" width="80px" height="80px" />'
							+	'</a>'
							+	'</div>'
							+	'<div class="col col-name">'
							+	'<h3 class="name">'+ obj.name+'&nbsp'+obj.memory+'</h3>'
							+	'<p class="desc">'
							+	'<span>适配机型：</span>'
							+	'小米手机5</p>'
							+	'</div>'
							+	'<div class="col col-price">'+obj.price+'</div>'
							+	'<div class="col col-num">'
							+	'<div class="change-goods-num clearfix" id="J_changeGoodsNum">'
							+	'<a href="javascript:void(0)" class="J_minus">-</a>'
							+	'<input tyep="text" name="1161500012_1_buy" value="'+goods.amount+'" data-num="'+goods.amount+'" data-buylimit="10" autocomplete="off" class="goods-num J_goodsNum">'
							+	'<a href="javascript:void(0)" class="J_plus">＋</a>'			
							+	'<div class="msg J_canBuyLimit">'
							+	'还可以买'+parseInt(10-goods.amount)+'件'
							+	'</div>'
							+	'</div>'
							+	'</div>'
							+	'<div class="col col-total">'
							+'<span id="changeCol">'+col+'元'+'</span>'
							+	'<p class="pre-info">'
							+	'已优惠117元'
							+	'</p>'
							+	'</div>'
							+	'<div class="col col-action">'
							+	'<a  data-msg="确定删除吗？"  title="删除" class="del J_delGoods">×</a>'
							+	'</div>'
							+	'</div>'
							+	'</div>'
							+	'</div>'
				}
			}
			popStr += cartStr;
			$('#J_cartListBody').append(popStr)
		},
		//增加数量
		increaseClick:function(){
			var that = this;
			$('.J_plus').on('click',function(){
				var max = 10;
				var val = parseInt($(this).prev().val());
				if(val >= max){
					return;
				}
				val++;
				that.optionHandle($(this),val);
				$(this).prev().val(val);
			})
		},
		//减少数量
		decreaseClick: function(){
			var that = this;
			$('.J_minus').on('click',function(){
				//判断有没有达下限
				var val = parseInt( $(this).next().val() );
				if(val <= 1){
					return ;
				}
				val--;
				that.optionHandle($(this),val);
				$(this).next().val(val);
				
			});
		},
		optionHandle:function(obj,val){
			//处理总价
			var money = obj.parents('.item-box').find('#changeCol');
			var price = obj.parents('.item-box').find('.col-price');
			var totalMoney = val * parseFloat(price.text());
			totalMoney = totalMoney.toFixed(2);
			money.text(totalMoney);
			var id = obj.parents('.item-box').attr('data-id');
			var gid = obj.parents('.item-row').attr('data-gd');
			$('.J_canBuyLimit').html('还可以买'+parseInt(10-val)+'件');
			this.cart[id].gcolor[gid].gamount = val;
			console.log(gid,id);
			this.setCart();
		},
		//文本框处理
		handleInput:function(){
			var that = this;
			$('.J_goodsNum').on('input propertychange',function(){
				//处理上限
				var max = 10;
				var val = parseInt( $(this).val() );
				if(val >= max){
					val = max;
				}
				//合法性验证
				var reg = /^[1-9]\d*$/;
				if(!reg.test(val)){
					val = 1;
				}
				that.optionHandle($(this),val);
				$(this).val(val);
			});
		},
		//删除
		delete: function(){
			var that = this;
			$('.J_delGoods').on('click',function(){
				var obj = $(this);
				model.show(function(){
					that.readCart();
					var item =obj.parents('.item-box');
					var id = item.attr('data-id');
					var gid = obj.parents('.item-row').attr('data-gd');
					item.remove();
					delete that.cart[id].gcolor[gid];
					that.setCart();
				});
				$('#title').html($(this).data('msg'))
//				if(confirm('确定删除宝贝吗？')){
//					var ul = $(this).parents('.cart-goods-item');
//					var gid = ul.attr('data-gid');
//					var id = $(this).parents('.cart-shop-item').attr('data-id');
//					//从页面中清除当前商品
//					ul.remove();
//					//从数据中清除当前商品
//					delete that.cart[id].goods[gid];
//					that.setCart();
//					//delete
//				}
		});
		},
		
		//商品复选框选择
		checkboxSelect:function(){
			var allNum = $('.J_goodsNum');
			var all = $('#J_cartTotalNum');
			var selectAll = $('#J_selTotalNum');
			var allNeed = $('.icon-check ');
			var num = 0;
			for(var i=0;i<allNum.length;i++){
				num += parseInt(allNum.eq(i).val());
			}
			all.html(num-1);
			
		},
		//所有商品全选
		selectAll: function(){
			$('#J_selectAll').click(function(){
				console.log(1)
				var allShop = $('#J_cartListBody').find('input[type="checkbox"]');
				//如果选中【全选】，将所有店铺选中
				if($(this).prop('checked')){
					allShop.prop('checked',true);
				}else{
					allShop.prop('checked',false);
				}
			});
		},
		//读取购物车cookie
		readCart: function(){
			this.cart = $.cookie('xiaomi-five');
			this.cart = JSON.parse(this.cart);
			console.log(this.cart);
		},
		//设置购物车cookie
		setCart: function(){
			$.cookie('xiaomi-five',JSON.stringify(this.cart),{expires: 7,path:'/mi'});
		}
	}
	cartHandler.init();
	
	
	//摸态框插件
	var model = {
	obj: $('#model'),
	cover: $('#model .model-content'),
	content: $('#model .confirm'),
	fn: null,
	init: function(){
		this.click();
	},
	show: function(fn){
		this.fn = fn;
		this.cover.fadeIn();
		this.content.animate({
			'top':40
		},400)
	},
	hide: function(){
		this.cover.fadeOut();
		this.content.animate({
			'top':-270
		},300);
	},
	click: function(){
		var that = this;
		$('#model').on('click',function(e){
			if($(e.target).is('#model #xx,#model .left_btn,#model .model-content,#model .right_btn') ){
				that.hide();
			}
			that.fn = null;
		});
		$('#model .right_btn').on('click',function(){
			that.fn && that.fn();
		});
		}
	};
	model.init();

})
