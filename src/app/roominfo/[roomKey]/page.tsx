"use client";
import { Dialog, DialogContent } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SubletPostStore } from "@store/SubletPostStore";
import Map from "@shared/components/Map/Map";
import * as s from "@shared/styles/Public.styles";
import { ShareDialog } from "@shared/components/Popup/Popup";
import { StyleComponent } from "@shared/components/StaticComponents/StaticComponents";
import { bookingPopUpStore } from "@store/BookingPopUpStore";
import { useSearchDateStore } from "@core/Header/store/SearchDateStore";
import {
  RoomHost,
  RoomReservation,
  RoomDetail,
  RoomPrice,
  ImageCarousel,
} from "@shared/components/RoomInfo";
import { RoomTitle } from "@shared/styles/RoomInfo.styles";
import {
  FetchGetMyUser,
  FetchLogin,
} from "@shared/components/FetchList/FetchList";
import { Post } from "@app/PostType";

export default function RoomInfo() {
  // 새 창에서 열릴 때 props를 못 받아와서, zustand의 전역 저장소를 사용한다.
  const { roomKey } = useParams<{ roomKey: string }>();
  const nowRoomNum = Number(roomKey);

  const [nowRoomPost, setNowRoomPost] = useState<Post | undefined>(undefined);
  const [sharePopUpState, setSharePopUpState] = useState(false);
  const { post, postExist, postAll } = SubletPostStore((state) => ({
    post: state.post,
    postExist: state.postExist,
    postAll: state.postAll,
  }));
  const { page, asyncGetPost, asyncGetPostAll } = SubletPostStore((state) => ({
    page: state.page,
    asyncGetPost: state.asyncGetPost,
    asyncGetPostAll: state.asyncGetPostAll,
  }));

  useEffect(() => {
    if (!postExist) {
      asyncGetPostAll();
    }
    setNowRoomPost(postAll.find((post) => post.key === nowRoomNum));
  }, [postExist]);

  //페이지 이동 부분
  // const navigate = useNavigate();
  const { setStartDay, setEndDay, setDayPay, setTotalPay, setPostKey } =
    bookingPopUpStore((state) => ({
      setStartDay: state.setTempStartDayState,
      setEndDay: state.setTempEndDayState,
      setDayPay: state.setDayPayState,
      setTotalPay: state.setTotalPayState,
      setPostKey: state.setPostKey,
    }));
  const { searchDate } = useSearchDateStore();
  const [userInfo, setUserInfo] = useState();
  // const IsLogin = async () => {
  //   const json = FetchIsLogin(setUserInfo);

  //   if (json.statusCode === 403) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };
  const moveToBooking = () => {
    //로그인 되어 있으면 booking.js로 넘기고, 로그인이 안 되어 있으면 로그인 모달 창 띄우기
    //console.log(IsLogin()); //몰루겟다
    // console.log(
    //   IsLogin().then((result) => {
    //     return result;
    //   })
    // );
    // if (IsLogin().then((result) => { return result; })) {
    //   setStartDay(searchDate[0]);
    //   setEndDay(searchDate[1]);
    //   setDayPay(nowRoomPost.price);
    //   setTotalPay(nowRoomPost.price * getDateDiff(searchDate[0], searchDate[1]));
    //   setPostKey(nowRoomNum);
    //   navigate(`/booking`);
    // } else {
    //   alert('로그인이 필요합니다.');
    // }
  };

  return (
    <>
      <ImageCarousel>
        {postExist &&
          postAll
            .find((post) => post.key == nowRoomNum)
            ?.image_id.map((image_id, index) => (
              <img
                key={index}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${image_id}.jpg`}
                alt={`image ${index}`}
                className="h-full object-cover m-auto"
              />
            ))}
      </ImageCarousel>

      {postExist && nowRoomPost && (
        <>
          <div>
            <s.NormalButton
              onClick={() => {
                setSharePopUpState(true);
              }}
            >
              공유하기
            </s.NormalButton>
            <Dialog
              open={sharePopUpState}
              className="border border-gray-300 shadow-xl rounded-lg"
            >
              <DialogContent sx={{ height: 224 }} className="text-left">
                <form className="flot-right">
                  <s.NormalButton
                    type="button"
                    name="sharePopUpState"
                    onClick={() => {
                      setSharePopUpState(false);
                    }}
                  >
                    <StyleComponent content="CloseButton" />
                  </s.NormalButton>
                </form>

                <ShareDialog
                  description={nowRoomPost.description}
                  title={nowRoomPost.title}
                  image_id={nowRoomPost.image_id}
                  // className="clear-both"
                />
              </DialogContent>
            </Dialog>
          </div>
          {/* {console.log(nowRoomPost)} */}

          <RoomTitle>
            {nowRoomPost.title} {`(숙소번호 : ${nowRoomNum})`}
          </RoomTitle>
          <RoomPrice nowRoomPost={nowRoomPost} />
          <RoomDetail nowRoomPost={nowRoomPost} />

          <section className="mx-3 mb-6">
            <div className="text-xl font-bold">지도</div>
            <div className="h-1/6 overflow-hidden px-10">
              {/*postExist && <Map />*/}
            </div>
          </section>

          <RoomReservation
            nowRoomPost={nowRoomPost}
            moveToBooking={moveToBooking}
            searchDate={searchDate}
          />

          <RoomHost />
        </>
      )}
    </>
  );
}
