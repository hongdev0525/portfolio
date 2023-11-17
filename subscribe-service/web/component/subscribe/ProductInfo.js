import styled from "styled-components";
import { SubsTitle } from "./CommonComponent";
import { useRecoilValue } from "recoil";
import { subscribeState } from "../../state/subscribe";
import { Notice } from "../common/GlobalComponent";
import { useEffect } from "react";
import { common } from "../../public/js/common";
const ProductInfoContainer = styled.div`
`

const ProductInfoBox = styled.div`

  border: 2px solid #232323;
  border-radius: 10px;
  min-height: 100px;
  padding: 20px ;
`

const ProductAmountContainer = styled.div`
    display: flex;
  justify-content: space-around;
`

const TotalPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  & > h2{
    margin-bottom:8px;
  }
  & > p{
    font-size: 46px;
    font-weight: bold;
  }
`

const DowProduct = styled.div`

`

const Dow = styled.div`
  font-size:24px;
  font-weight: bold;
  margin-bottom: 8px;
`

function ProductInfo() {
  const subscribeStateInfo = useRecoilValue(subscribeState);

  const TotalPrice = () => {
    let totalPrice = 0;
    let discount = 0;
    const totalAmount = 0;
    for (let i = 0; i < subscribeStateInfo.dows.length; i++) {
      const dow = subscribeStateInfo.dows[i];
      const productPrice = 0;
      for (let n = 0; n < subscribeStateInfo.product.length; n++) {
        const product = subscribeStateInfo.product[n];
        if(dow === product.dow){
          totalAmount+=product.amount;
          productPrice += (parseInt(product["price"]) * product["amount"]) 
        }
      }
      if (totalAmount >= 2) discount = 1000;

      totalPrice += productPrice - discount;
      
      console.log("totalprice : ",totalAmount,totalPrice)
    }
    

    return <TotalPriceContainer>
      <h2>총 주문금액</h2>
      <p>{common.numberCommaFormat(totalPrice)}원</p>
    </TotalPriceContainer>
  }

  useEffect(() => {
    TotalPrice()
  }, [subscribeStateInfo.product])





  return (
    <ProductInfoContainer>
      <SubsTitle>구독 결제정보</SubsTitle>
      {
        subscribeStateInfo && subscribeStateInfo.product.length !== 0
          ?
          <>
            <ProductInfoBox>
              <ProductAmountContainer>
                {subscribeStateInfo.dows.map((dows, index) => {
                  let tmp = [];
                  for (let i = 0; i < subscribeStateInfo.product.length; i++) {
                    const product = subscribeStateInfo.product[i];
                    if (dows === product.dow) {
                      tmp.push(<p key={`productDetails${i}`}>{product.name}-{product.amount}</p>)
                    }
                  }
                  return <DowProduct key={`productInfo${index}`}>
                    <Dow> {dows}</Dow>{tmp}
                  </DowProduct>
                })
                }
              </ProductAmountContainer>
              <TotalPrice></TotalPrice>
            </ProductInfoBox>
          </>
          :
          <Notice>
            상품 수량을 선택해주세요.
          </Notice>
      }
    </ProductInfoContainer>
  );
}

export default ProductInfo;