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
  width: 100%;
  margin-bottom: 20px;
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

const ProductInfoGroup = styled(PaymentInfoGroup)`
    align-items: flex-start;
  @media ${device.mobileL} {
    flex-direction: column;
    margin-bottom: 0px;
  }
`
const OrderProductInfoGroup = styled(PaymentInfoGroup)`
    align-items: flex-start;
  @media ${device.mobileL} {
    align-items: center;
    margin-bottom: 0px;
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

      width: 100%;
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
    margin-top:8px;
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




function PaymentInfo({ paymentDetails, title = true, experience = false }) {
  const [totalCount, setTotalCount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const paymentDetailsInfo = paymentDetails;
  const deliveryDows = paymentDetails.dows.join("요일,") + "요일";

  const productCountList = (dow) => {
    let str = [];
    let count = 0;
    paymentDetailsInfo.product.map(product => {
      if (product.dow === dow) {
        str.push(`${product.name} ${product.amount}개`);
        count += product.amount;
      }
    })
    str = str.length !== 0 ? str.join(", ") + (experience == false ? " X  4주" : "") : str.join(", ")
    return { product: str, count: count }
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
    paymentDetailsInfo.product?.map(product => {
      count += product.amount
    })
    setTotalCount(count * (experience == false ? 4 : 1));
  }, [paymentDetailsInfo?.product])

  useEffect(() => {
    setDiscountAmount(totalDiscountAmount());
  }, [paymentDetailsInfo?.milesAmount, paymentDetailsInfo?.coupon])




  return (
    <PaymentInfoWrapper>
      {title == true &&
        <Title>총 결제정보</Title>
      }
      <PaymentInfoContainer>
        <PaymentInfoList>
          <PaymentInfoGroupContainer>
            <PaymentInfoLabel>{experience == false ? "구독요일" : "배송요일"}</PaymentInfoLabel>
            <PaymentInfoDetails>
              {paymentDetailsInfo && paymentDetailsInfo.dows &&
                deliveryDows
              }
            </PaymentInfoDetails>
          </PaymentInfoGroupContainer>
          <PaymentInfoGroupContainer>
            <PaymentInfoLabel>첫 배송일</PaymentInfoLabel>
            <PaymentInfoDetails>
              {common.DateFormatting(paymentDetailsInfo.deliveryDate).split(" ")[0]}
            </PaymentInfoDetails>
          </PaymentInfoGroupContainer>

          <ProductInfoGroupContainer>
            <ProductInfoGroup>
              <PaymentInfoLabel>구독정보</PaymentInfoLabel>
              <ProductInfoDetails>
                {paymentDetailsInfo && paymentDetailsInfo.product && paymentDetailsInfo.dows &&
                  paymentDetailsInfo.dows.map((dow, index) => {
                    return (
                      <ProductInfo key={`${dow}${index}`}>
                        <p>{dow}요일</p>
                        <Products>
                          {productCountList(dow).product}
                        </Products>
                        <span>{productCountList(dow).count * (experience == false ? 4 : 1)}개</span>
                      </ProductInfo>
                    )
                  })
                }
              </ProductInfoDetails>
            </ProductInfoGroup>

            <TotalInfo><span>총 상품수량</span>{totalCount}개</TotalInfo>
          </ProductInfoGroupContainer>
          <ProductInfoGroupContainer>
            <PaymentInfoGroup>
              <PaymentInfoLabel>구독금액</PaymentInfoLabel>
              <PaymentInfoDetails>
                <span>{common.numberCommaFormat(paymentDetailsInfo.totalPrice ? paymentDetailsInfo.totalPrice : 0)}원</span>
              </PaymentInfoDetails>
            </PaymentInfoGroup>
            <ProductInfoGroup>
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
                  <CouponInfo>
                    <p>현키 포인트</p>
                    <span>-{common.numberCommaFormat(paymentDetailsInfo.milesAmount)}원</span>
                  </CouponInfo>
                }
              </ProductInfoDetails>
            </ProductInfoGroup>
            <TotalInfo>
              <span>총 할인금액 </span> -{common.numberCommaFormat(discountAmount + (paymentDetailsInfo.amountDiscount ? paymentDetailsInfo.amountDiscount * 1000 : 0))}원
            </TotalInfo>
          </ProductInfoGroupContainer>
        </PaymentInfoList>
        <TotalInfo><span>총 결제금액</span><h2>{common.numberCommaFormat((paymentDetailsInfo.defaultDiscountPrice ? parseInt(paymentDetailsInfo.defaultDiscountPrice) : 0) - parseInt(discountAmount))}원</h2></TotalInfo>
      </PaymentInfoContainer>
    </PaymentInfoWrapper >
  );
}

export default PaymentInfo;