import { fontWeight } from "component/common/CommonComponent";
import { Title } from "../../subscribe/CommonComponent";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { subscribeState } from "state/subscribe";
import { common } from "public/js/common";
import { useState } from "react";
import { useEffect } from "react";
import { device } from "../../common/GlobalComponent";


const PaymentInfoWrapper = styled.div`
`
const PaymentInfoContainer = styled.div`
  width: 100%;
  background-color: #fefefe;
  border: 1px solid #DC5F00;  
  padding: 12px 40px  52px;
  border-radius: 10px;
  margin-top: 20px;
  @media ${device.mobileL} {
    width: 100%;
    padding:20px;
    margin-top: 30px;
  }
`
const PaymentInfoList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${device.mobileL} {
    padding:20px 0 ;
  }
`
const PaymentInfoGroupContainer = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 30px 0 ;
    border-bottom: 0.5px solid #A9A9A8;
    @media ${device.mobileL} {
    padding:20px 0 ;
    :nth-of-type(1){
      padding-top: 0%;
    }
  }
`

const ProductInfoGroupContainer = styled(PaymentInfoGroupContainer)`
  flex-direction: column;
`

const PaymentInfoGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media ${device.mobileL} {
    margin-bottom: 8px;
  }
`



const PaymentInfoLabel = styled.p`
    font-size: 18px;
    line-height: 39px;
    font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    font-size: 12px;
    line-height: 16px;
    font-weight: ${fontWeight("regular")};
  }
`
const PaymentInfoDetails = styled.div`
    font-size: 18px;
    line-height: 39px;
    font-weight: ${fontWeight("regular")};
    span{
      font-weight: ${fontWeight("regular")};
    }

    @media ${device.mobileL} {
    font-size: 12px;
    line-height: 14px;
    font-weight: ${fontWeight("bold")};
    span{
      font-weight: ${fontWeight("regular")};
    }
  }
`
const ProductInfoDetails = styled(PaymentInfoDetails)`
    width: 80%;
    font-size: 24px;
    line-height: 39px;
    font-weight: ${fontWeight("bold")};
    span{
      font-weight: ${fontWeight("regular")};
    }

    @media ${device.mobileL} {

      font-size: 14px;
      line-height: 15px;
      font-weight: ${fontWeight("bold")};
      span{
        font-weight: ${fontWeight("regular")};
      }
  }
`

const ProductInfo = styled.div`
   display: flex;
   justify-content: flex-end;
   align-items: center;
   text-align: right;
   margin-bottom: 8px;
    font-size: 18px;
  p{
    font-size: 18px;
    line-height: 24px;
    font-weight: ${fontWeight("regular")};
    width:20%;
  }
  span{
    font-size: 18px;
    line-height: 24px;
    font-weight: ${fontWeight("bold")};
    margin-left: 32px;
    width:10%;
  }

  @media ${device.mobileL} {
    p{
      font-size: 12px;
      line-height: 15px;
      font-weight: ${fontWeight("regular")};
      margin-left: 3px;
      flex-basis:15%;
    }
    span{
      font-size: 12px;
      line-height: 15px;
      font-weight: ${fontWeight("bold")};
      margin-left: 3px;
      flex-basis:13%;
    }
  }
`

const CouponInfo = styled.div`
   display: flex;
   justify-content: flex-end;
   align-items: center;
   text-align: right;
   margin-bottom: 10px;
  p{
    font-size: 18px;
    line-height: 35px;
    font-weight: ${fontWeight("regular")};
    margin-left: 32px;
  }
  span{
    font-size: 18px;
    line-height: 35px;
    font-weight: ${fontWeight("semiBold")};
    margin-left: 32px;
  }
  @media ${device.mobileL} {
    margin-left: auto;
    p{
      font-size: 12px;
      line-height: 13px;
      font-weight: ${fontWeight("regular")};
      margin-left: 32px;
    }
    span{
      font-size: 12px;
      line-height: 13px;
      font-weight: ${fontWeight("bold")};
      margin-left: 32px;
    }

  }
`
const Products = styled.div`
  min-width: 271px;
  width: 65%;
  font-weight: ${fontWeight("regular")};
  @media ${device.mobileL} {
    font-size: 12px;
    min-width: auto;
    flex-basis:80%;

  }
`
const ProductCount = styled.span`
    font-weight: ${fontWeight("regular")};
`
const TotalInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  text-align: right;
  font-size:20px;
  line-height: 33px;
  font-weight: ${fontWeight("semiBold")};
  margin-top: 30px;
  color:#DC5F00;
  & span{
      font-size:18px;
      line-height: 33px;
      font-weight: ${fontWeight("semiBold")};
      margin-right: 22px;
      color:#DC5F00;

  }
  & h2{
    font-size: 24px;
      font-weight: ${fontWeight("bold")};
      color:#DC5F00;
  }

  @media ${device.mobileL} {
    text-align: right;
    font-size:12px;
    line-height: 12px;
    font-weight: ${fontWeight("bold")};
    margin-top: 15px;
    color:#DC5F00;
    & span{
        font-size:12px;
        line-height: 13px;
        font-weight: ${fontWeight("semiBold")};
        margin-right: 22px;
        color:#DC5F00;

    }
    & h2{
      font-size:16px;
    }


  }
`




function OrderPaymentInfo({ paymentDetails, initialProductInfo }) {
  const [totalCount, setTotalCount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [initialProduct, setInitialProduct] = useState(initialProductInfo)
  const paymentDetailsInfo = paymentDetails;
  const productCountList = (dow) => {
    let str = [];
    let count = 0;
    paymentDetailsInfo.product.map(product => {
      if (product.dow === dow) {
        str.push(`${product.name} ${product.amount}개`);
        count += product.amount;
      }
    })
    str = str.join(", ")
    return { product: str, count: count }
  }


  const orderProductCountList = (dow) => {
    let str = [];
    let count = 0;
    if (initialProduct && initialProduct.product) {
      initialProduct.product.map(product => {
        if (product.dow === dow) {
          str.push(`${product.name} ${product.amount}개`);
          count += product.amount;
        }
      })
      str = str.join(", ")
      return { product: str, count: count }
    }
  }


  const totalDiscountAmount = () => {
    const discountType = paymentDetailsInfo.coupon?.type;
    const discount = paymentDetailsInfo.coupon?.discount;
    const milesAmount = parseInt(paymentDetailsInfo.milesAmount ? paymentDetailsInfo.milesAmount : 0);
    let totalDiscount = 0;
    if (discountType && discount) {
      if (discountType === "money") {
        totalDiscount = milesAmount + discount;
      } else {
        totalDiscount = milesAmount + parseInt(paymentDetailsInfo.totalPrice) * (parseInt(discount) / 100);
      }
    } else {
      totalDiscount = milesAmount;
    }
    return totalDiscount;

  }


  useEffect(() => {

    let count = 0;
    paymentDetailsInfo.product.map(product => {
      count += product.amount
    })
    setTotalCount(count);
  }, [paymentDetailsInfo?.product])

  useEffect(() => {
    setDiscountAmount(totalDiscountAmount());
  }, [paymentDetailsInfo?.milesAmount, paymentDetailsInfo?.coupon])




  return (
    <PaymentInfoWrapper>
      <Title>총 결제정보</Title>
      <PaymentInfoContainer>
        <PaymentInfoList>
          <ProductInfoGroupContainer>
            <PaymentInfoGroup>
              <PaymentInfoLabel>변경 전 수량</PaymentInfoLabel>
              <ProductInfoDetails>
                {paymentDetailsInfo && paymentDetailsInfo.product && paymentDetailsInfo.dows &&
                  paymentDetailsInfo.dows.map((dow, index) => {
                    return (
                      <ProductInfo key={`${dow}${index}`}>
                        <Products>
                          {orderProductCountList(dow).product}
                        </Products>
                        <span>{orderProductCountList(dow).count}개</span>
                      </ProductInfo>
                    )
                  })
                }
              </ProductInfoDetails>
            </PaymentInfoGroup>
            <PaymentInfoGroup>
              <PaymentInfoLabel>변경 후 수량</PaymentInfoLabel>
              <ProductInfoDetails>
                {paymentDetailsInfo && paymentDetailsInfo.product && paymentDetailsInfo.dows &&
                  paymentDetailsInfo.dows.map((dow, index) => {
                    return (
                      <ProductInfo key={`${dow}${index}`}>
                        <Products>
                          {productCountList(dow).product}
                        </Products>
                        <span>{productCountList(dow).count}개</span>
                      </ProductInfo>
                    )
                  })
                }
              </ProductInfoDetails>
            </PaymentInfoGroup>
            <TotalInfo><span>총 상품수량</span>{totalCount}개</TotalInfo>
          </ProductInfoGroupContainer>
          <ProductInfoGroupContainer>
            <PaymentInfoGroup>
              <PaymentInfoLabel>변경 전 금액</PaymentInfoLabel>
              <PaymentInfoDetails>
                <span>{common.numberCommaFormat(initialProduct.defaultDiscountPrice ? initialProduct.defaultDiscountPrice : 0)}원</span>
              </PaymentInfoDetails>
            </PaymentInfoGroup>
            <PaymentInfoGroup>
              <PaymentInfoLabel>변경 후 금액</PaymentInfoLabel>
              <PaymentInfoDetails>
                <span>{common.numberCommaFormat(paymentDetailsInfo.totalPrice ? paymentDetailsInfo.totalPrice : 0)}원</span>
              </PaymentInfoDetails>
            </PaymentInfoGroup>
            <PaymentInfoGroup>
              <PaymentInfoLabel>할인금액</PaymentInfoLabel>
              <ProductInfoDetails>
                {paymentDetailsInfo.amountDiscount != null &&
                  paymentDetailsInfo.amountDiscount?.length !== 0 &&
                  paymentDetailsInfo.amountDiscount !== 0 &&
                  <CouponInfo>
                    <p>요일별 2개 이상 할인</p>
                    <span>-{common.numberCommaFormat(paymentDetailsInfo.amountDiscount * 1000)}원</span>
                  </CouponInfo>
                }
                {
                  paymentDetailsInfo.coupon?.discount != null &&
                  paymentDetailsInfo.coupon?.type != null &&
                  paymentDetailsInfo.coupon?.length !== 0 &&
                  <CouponInfo>
                    <p>{paymentDetailsInfo.coupon.name}</p>
                    <span>-{common.numberCommaFormat(paymentDetailsInfo.coupon.discount)}{paymentDetailsInfo.coupon.type === "money" ? "원" : "%"}</span>
                  </CouponInfo>
                }
                {
                  paymentDetailsInfo.milesAmount != null &&
                  parseInt(paymentDetailsInfo.milesAmount) !== 0 &&
                  parseInt(paymentDetailsInfo.milesAmount) >= 0 &&
                  <CouponInfo>
                    <p>현키 포인트</p>
                    <span>-{common.numberCommaFormat(paymentDetailsInfo.milesAmount)}원</span>
                  </CouponInfo>
                }
              </ProductInfoDetails>
            </PaymentInfoGroup>
            <TotalInfo>
              <span>총 할인금액 </span> -{common.numberCommaFormat(discountAmount + (paymentDetailsInfo.amountDiscount ? parseInt(paymentDetailsInfo.amountDiscount * 1000) : 0))}원
            </TotalInfo>
          </ProductInfoGroupContainer>
        </PaymentInfoList>
        <TotalInfo>
          {(paymentDetailsInfo.defaultDiscountPrice - initialProduct.defaultDiscountPrice) < 0 ?
            <>
              <span>환불 포인트</span>
              <h2>
                {common.numberCommaFormat(initialProduct.defaultDiscountPrice - paymentDetailsInfo.defaultDiscountPrice - parseInt(discountAmount))}
              </h2>
            </>
            :
            <>
              <span>결제 금액</span>
              <h2>
                {common.numberCommaFormat((paymentDetailsInfo.defaultDiscountPrice ? parseInt(paymentDetailsInfo.defaultDiscountPrice) : 0) - initialProduct.defaultDiscountPrice - parseInt(discountAmount))}원
              </h2>
            </>

          }
        </TotalInfo>
      </PaymentInfoContainer>
    </PaymentInfoWrapper >
  );
}

export default OrderPaymentInfo;