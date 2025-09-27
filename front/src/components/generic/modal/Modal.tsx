import {
  type PropsWithChildren,
  useEffect,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
import { Close } from "@mui/icons-material";
import type { ModalPosition } from "../../../constant/modal/modalPosition";

interface Props {
  noCloseButton?: boolean;
  closeModal?: () => void;
  position?: ModalPosition;
  title?: string;
  minWidth?: number;
}

export default function Modal(props: PropsWithChildren<Props>) {
  const [showContent, setShowContent] = useState(false);
  const [, setDomReady] = useState(false);

  const appContentDiv = document.getElementById("app-container");

  //On open
  useEffect(() => {
    setShowContent(true);
  }, []);

  useEffect(() => {
    setDomReady(true);
  }, []);

  const stop = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleCloseClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.closeModal && props.closeModal();
  };

  return createPortal(
    <div
      className={`modal-background ${props.position ? props.position : "center"}`}
      onClick={stop} // prevent clicks inside the portal from bubbling to parent React tree
    >
      <div
        id="modal"
        className={`modal-container ${showContent ? "show-modal" : ""}`}
        onClick={stop}
      >
        <div className="header">
          <div className="modal-title">{props.title}</div>
          {!props.noCloseButton && (
            <div className="close-modal" onClick={handleCloseClick}>
              <Close />
            </div>
          )}
        </div>
        <div
          className="modal-content"
          style={{ minWidth: props.minWidth ?? 20 }}
        >
          {props.children}
        </div>
      </div>
    </div>,
    appContentDiv!,
  );
}
