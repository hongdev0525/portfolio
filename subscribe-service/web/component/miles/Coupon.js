import styled from "styled-components";
import { Button, InputLabel, Input } from '../common/GlobalComponent';
import { fontWeight } from "component/common/CommonComponent";
import { useQuery } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import { customAxios } from "public/js/customAxios";
import { subscribeState } from '../../state/subscribe';
import { device } from "../common/GlobalComponent";
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useRef } from "react";
import { common } from "public/js/common";
import { milesState } from "state/miles";


const CouponInputGroupContainer = styled.div`
  margin-bottom: 20px;

 @media ${device.mobileL} {
    margin-top: 15px;
  }
`

const CouponInputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  
  @media ${device.mobileL} {
    margin-bottom: 5px;
  }
`

const CouponInputLabel = styled(InputLabel)`
  display:flex;
  align-items: center;
  font-size: 18px;
  line-height: 36px;
  font-weight: ${fontWeight("medium")};
  @media ${device.mobileL} {
    font-size: 14px;
    line-height: 25px;
    font-weight: ${fontWeight("medium")};
    padding-left:5px;
    margin-bottom: 5px;
  }
`


const CouponInput = styled(Input)`
  width: 447px;
  @media ${device.mobileL} {
    width: 221px;
  }
`


const CouponButton = styled(Button)`
  width: 137px;
  height: 56px;
  border-radius: 5px;
  font-size:16px;
  line-height: 38px;
  font-weight: ${fontWeight("semiBold")};
  @media ${device.mobileL} {
      width: 111px;
      height: 48px;
      border-radius: 5px;
      font-size:14px;
      line-height: 15px;
      font-weight: ${fontWeight("medium")};
    }
`

const Coupon = styled.div`
  display: flex;
  font-size: 16px;
  line-height: 26px;
  font-weight: ${fontWeight("regular")};
  padding-left: 10px;
  color: #DC5F00;
  p{
    font-size: 18px;
    line-height: 26px;
    font-weight: ${fontWeight("regular")};
    padding-left: 10px;
    color: #DC5F00;
  }
  @media ${device.mobileL} {
    font-size: 10px;
    line-height: 10px;  
    padding-left: 5px;
    margin-bottom: 0px;
    margin-top: 5px;
    p{
      font-size: 10px;
      line-height: 10px;
      font-weight: ${fontWeight("regular")};
      padding-left: 10px;
      color: #DC5F00;
    }
  }
`

function Coupoon({ stateKey }) {

  const milesStateInfo = useRecoilValue(milesState(stateKey));
  const setMilesState = useSetRecoilState(milesState(stateKey));

  const [couponInput, setCouponInput] = useState(null);

  const validatingCoupon = async () => {
    return await customAxios({
      method: "POST",
      data: {
        couponCode: couponInput
      },
      withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_SERVER}/miles/validatingcoupon`,
    })
  };

  const { refetch: validatingCouponRefetch } = useQuery("validatingCoupon", validatingCoupon, {
    enabled: false,
    onSuccess: (res) => {
      console.log(res);
      const response = res.data
      if (response.status === "not exist") {
        setMilesState((oldState) => {
          return {
            ...oldState,
            coupon: {
              ...oldState.code,
              validation: false,
            }
          }
        })

      } else {
        const couponInfo = response.data;
        setMilesState((oldState) => {
          return {
            ...oldState,
            coupon: {
              code: couponInfo.CouponCode,
              name: couponInfo.CouponName,
              type: couponInfo.DiscountType,
              discount: couponInfo.Discount,
              validation: true,
            }
          }
        })
      }
    },
    onError: (error) => {
      console.error(error);
    }
  })


  const handleCouponInput = (e) => {
    setCouponInput(e.currentTarget.value)
  }

  return (
    <CouponInputGroupContainer>
      <CouponInputLabel>
        쿠폰코드
      </CouponInputLabel>
      <CouponInputGroup>
        <CouponInput
          type="text"
          name="coupon"
          onChange={(e) => handleCouponInput(e)}
          maxLength="50"
          placeholder="쿠폰을 입력해주세요."
        />
        <CouponButton type="button" onClick={validatingCouponRefetch}>코드확인</CouponButton>
      </CouponInputGroup>
      {milesStateInfo.coupon?.validation === false &&
        <Coupon>존재하지 않는 쿠폰입니다.</Coupon>
      }
      {milesStateInfo.coupon?.validation === true &&
        <Coupon>사용 가능한 쿠폰입니다. ({milesStateInfo.coupon.name} - {milesStateInfo.coupon.discount}{milesStateInfo.coupon.type === "percent" ? "%" : "원"} 할인)</Coupon>
      }
    </CouponInputGroupContainer>

  );
}

export default Coupoon;