import { FetchDeleteReservation } from "@shared/components/FetchList/FetchList";
import { DialogForm } from "@shared/components/Popup/Popup";
import {
  DeleteButton,
  DisableButton,
  NormalText,
} from "@shared/styles/Public.styles";
import { Checkbox, DialogActions, DialogContent } from "@mui/material";
import React from "react";

export function CancleReservationDialog({
  popupState,
  clickHandler,
  checkState,
  checkHandled,
  roomKey,
}: {
  popupState: boolean;
  clickHandler: React.MouseEventHandler<HTMLButtonElement>;
  checkState: boolean;
  checkHandled: React.Dispatch<React.SetStateAction<boolean>>;
  roomKey: number;
}) {
  return (
    <DialogForm
      openState={popupState}
      handleClose={clickHandler}
      name="editRoomDialogShow"
      render={() => (
        <label
          htmlFor="test"
          className="block mb-2 text-sm font-medium text-gray-900 float-left"
        >
          test
        </label>
      )}
    >
      <DialogContent className="font-black text-center">
        <p className="text-lg font-extrabold mt-3">
          예약중인 숙소를 취소하시겠습니까?
        </p>
        <NormalText className="mt-3 ">
          <Checkbox
            checked={checkState}
            onChange={(_, checked) => checkHandled(checked)}
          />
          환불규정을 확인하였습니다.
        </NormalText>
      </DialogContent>
      <DialogActions>
        <div>
          {checkState ? (
            <form>
              <DeleteButton
                onClick={() => {
                  FetchDeleteReservation(roomKey);
                }}
              >
                취소하기
              </DeleteButton>
            </form>
          ) : (
            <DisableButton disabled>취소하기</DisableButton>
          )}
        </div>
      </DialogActions>
    </DialogForm>
  );
}
