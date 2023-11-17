import styled, { css } from 'styled-components'
import Image from 'next/image.js';
import { customAxios } from '../../public/js/customAxios.js';
import { useRecoilValue } from 'recoil'
import { deliveryDowState } from '../../state/subscribe';
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react';
import { subscribeState, productState } from '../../state/subscribe';
import { useSetRecoilState } from 'recoil';
import { fontWeight } from 'component/common/CommonComponent.js';
import { device } from "component/common/GlobalComponent";
import { isMobile } from 'react-device-detect';

const ProductContainer = styled.div`
	margin-bottom: 50px;
	@media ${device.mobileL} {
    margin-bottom: 38px;
	}
`
const ProductSection = styled.div`
    display: flex;
    flex-wrap: wrap;
`
const ProductBoxContainer = styled.div`
		display: flex;
		justify-content: space-between;
		align-items: center	;
    width: 100%;
		background-color: #fefefe;
		margin:8px 0 ;
		border: 1px solid #DBDBDB;
		border-radius: 10px;
	@media ${device.mobileL} {
		width: 100%;
		height: 220px;
		border-radius: 10px;
		margin:10px 0 0px;
	}

`
const ProductBox = styled.div`
		position: relative;
    display:flex;
		justify-content: space-between;
		width: 100%;
		padding:30px 69px;
	@media ${device.mobileL} {
		flex-direction: column;
		padding:35px 48px;
		height: 100%;
	}
`
const ProductTitle = styled.h2`
	font-size: 18px;
	font-weight: ${fontWeight("semiBold")};
	line-height: 22px;
	@media ${device.mobileL} {
		font-size: 16px;
		font-weight: ${fontWeight("medium")};
		line-height: 22px;
		padding-left: 10px;
	}
`

const SelectedProduct = styled.div`
    width:100%;
    margin-bottom: 24px;
		@media ${device.mobileL} {
			margin-bottom: 20px;
	}
`
const Box = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	height: 100%;
	@media ${device.mobileL} {
		flex-direction: row;
		justify-content: space-between;
		height: fit-content;
	}
`

const ProductLabel = styled.p`
	font-size : 18px;
	font-weight: ${fontWeight("medium")};
	line-height: 24px;
	margin-bottom: 14px;
	@media ${device.mobileL} {
		font-size: 16px;
		font-weight: ${fontWeight("medium")};
		line-height: 22px;
		margin-bottom: 0px;
	}
`

const CountBox = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	@media ${device.mobileL} {
		width: 135px;
	
	}
`

const Count = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 5px 5px 10px rgba(0,0,0,.05);
	border-radius: 10px;
	width: 62px;
	height: 42px;
	background-color: #fefefe;
	font-size: 24px;
	font-weight: ${fontWeight("regular")};
	margin:0 12px;

	${props => {
		return props.zero === false ?
			css`
			border: 1px solid #DC5F00;
			color: #DC5F00;
		`
			:
			css`
			border: 1px solid #BABABA;
			color: #BABABA;
		`

	}
	}



	@media ${device.mobileL} {
		width: 45px;
		height: 30px;
		font-size: 18px;
		line-height: 20px;
		margin:0 15px;
		border-radius: 5px;
		${props => {
		return props.zero === false ?
			css`
				border: 1px solid #DC5F00;
				color: #DC5F00;
			`
			:
			css`
				border: 1px solid #BABABA;
				color: #BABABA;
			`

	}
	}

	}
`

const CountButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	border:none;
	background: #fefefe;
	padding: 0;
	cursor: pointer;
`

const CloseButton = styled.button`
	position: absolute;
	top:15px;
	right: 15px;
	padding: 0;
	border:none;
	background: #fefefe;
	cursor: pointer;
	/* background-color: tomato; */
	@media ${device.mobileL} {
		
		top:15px;
		right: 15px;
		img{
			width: 10px;
			height: 10px;
		}
	}
`

const ProductNotice = styled.p`
	font-size: 16px;
	font-weight: ${fontWeight("regular")};
	color:#767676;
`


function Product({ selectedDowList, initialProductInfo, stateKey, title = true, closeBtn = true, experience = false }) {
	const [productInfoList, setProductInfoList] = useState(null);
	const setDeliveryDowState = useSetRecoilState(deliveryDowState(stateKey));
	const setProductState = useSetRecoilState(productState(stateKey));
	const productStateInfo = useRecoilValue(productState(stateKey));
	const [mobile, setMobile] = useState(null);


	const getProductInfo = async () => {
		return await customAxios({
			method: "GET",
			withCredentials: true,
			params: {
				codeType: "ITEM_CATEGORY"
			},
			url: `${process.env.NEXT_PUBLIC_API_SERVER}/code/getcodelist`,
		})
	}

	useQuery('getProductInfo', () => getProductInfo(), {
		onSuccess: (res) => {
			if (res.status === 200) {
				setProductInfoList(res.data.data)
			}
		},
		onError: (error) => {
			console.error("Error Occured : ", error)
		}
	})

	const cancelProduct = (dow) => {
		setProductState((oldState) => {
			let tmp = oldState.list.filter((element) => {
				return element["dow"] !== dow
			})
			return {
				...oldState,
				list: tmp
			}

		});
		setDeliveryDowState((oldState) => {
			const dowList = oldState.list.filter((element) => {
				return element !== dow
			})
			return {
				...oldState,
				list: dowList
			}
		})
	}



	const handleProductInfo = (type, dow, codekey, label, price) => {

		setProductState((oldState) => {
			const productList = oldState.list;
			let tmp = [...productList];
			let idx = null;
			for (let i = 0; i < productStateInfo.list.length; i++) {
				const product = productStateInfo.list[i];
				if (Object.values(product).indexOf(codekey) !== -1 && Object.values(product).indexOf(dow) !== -1) {
					idx = i;
					break;
				}
			}

			if (tmp.length === 0) {
				if (type !== "minus") {
					return {
						...oldState,
						list: [{
							key: codekey,
							name: label,
							price: parseInt(price),
							dow: dow,
							amount: 1
						}]
					}
				}
			}
			if (type === "minus" && idx !== null && tmp[idx]["amount"] - 1 === 0) {
				tmp.splice(idx, 1);
				return {
					...oldState,
					list: tmp
				}
			} else {
				if (idx !== null) {
					tmp[idx] = {
						key: codekey,
						name: label,
						price: parseInt(price),
						dow: dow,
						amount: type === "plus" ? tmp[idx]["amount"] + 1 : tmp[idx]["amount"] - 1 < 0 ? 0 : tmp[idx]["amount"] - 1
					}
					return {
						...oldState,
						list: tmp
					}
				} else {
					if (type !== "minus") {
						return {
							...oldState,
							list: [
								...productList,
								{
									key: codekey,
									name: label,
									price: parseInt(price),
									dow: dow,
									amount: 1
								}
							]
						}



					} else {
						return oldState
					}
				}


			}
		}

		)


	}


	useEffect(() => {
		setMobile(isMobile);
	}, [])


	useEffect(() => {

		if (initialProductInfo && initialProductInfo.length !== 0) {
			setProductState((oldState) => {
				return {
					...oldState,
					list: initialProductInfo
				}
			})
		}

	}, [initialProductInfo])


	const countingProduct = (codekey, dow) => {
		if (productStateInfo.list) {
			for (let i = 0; i < productStateInfo.list.length; i++) {
				const product = productStateInfo.list[i];
				if (Object.values(product).indexOf(codekey) !== -1 && Object.values(product).indexOf(dow) !== -1) {
					return product["amount"];
				}
			}
		}
	}

	// useEffect(() => {
	// 	console.log('productInfoList', productInfoList)
	// }, [productInfoList])

	return (
		<ProductContainer>
			<ProductSection>
				{selectedDowList.map((dow, index) => {
					return (
						<SelectedProduct key={index}>
							{title === true &&
								<ProductTitle>{dow}요일</ProductTitle>
							}
							<ProductBoxContainer>
								<ProductBox>
									{productInfoList &&
										productInfoList.map((product, index) => {
											return (<Box key={product.CodeNo}>
												<ProductLabel>{product.CodeLabel}</ProductLabel>
												<CountBox>
													<CountButton type='button' onClick={() => handleProductInfo("minus", dow, product.CodeKey, product.CodeLabel, experience == false ? product.CodeValue : product.CodeValue3)}>
														<Image src="/img/main/web/minusIcon.png" width={mobile == true ? 16 : 20} height={mobile == true ? 2 : 2} alt="- 아이콘"></Image>
													</CountButton>
													{
														countingProduct(product.CodeKey, dow) ? <Count zero={false}>{countingProduct(product.CodeKey, dow)}</Count> : <Count zero={true}>0</Count>
													}
													<CountButton type='button' onClick={() => handleProductInfo("plus", dow, product.CodeKey, product.CodeLabel, experience == false ? product.CodeValue : product.CodeValue3)}>
														<Image src="/img/main/web/plusIcon.png" width={mobile == true ? 16 : 20} height={mobile == true ? 16 : 20} alt="+ 아이콘"></Image>
													</CountButton>
												</CountBox>

											</Box>)
										})
									}
									{closeBtn &&
										<CloseButton onClick={() => cancelProduct(dow)}>
											<Image src="/img/main/web/crossIcon.png" width={14} height={14} alt="x 아이콘"></Image>
										</CloseButton>
									}
								</ProductBox>
							</ProductBoxContainer>
							{/* <ProductNotice>2개 이상 구매 시 1000원 할인해 드려요! </ProductNotice> */}
						</SelectedProduct>
					)
				})}
			</ProductSection>
		</ProductContainer >
	);
}

export default Product;