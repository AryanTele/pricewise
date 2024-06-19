"use client";
import React, { FormEvent, Fragment } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useState } from "react";
import Image from "next/image";
const Modal = () => {
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setisSubmitting(true);

    setisSubmitting(false);
    setEmail("");
    closeModal();
  };
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />
            <div className="dialog-content">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div className="p-3 border border-gray-200 rounded-10">
                    <Image
                      src="/assets/icons/logo.svg"
                      alt="logo"
                      width={28}
                      height={28}
                    />
                  </div>
                  <Image
                    src="/assets/icons/x-close.svg"
                    alt="close"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                    onClick={closeModal}
                  />
                </div>
                <h4 className="dialog-head_text">
                  Stay up-to-date with the latest product prices directly in
                  your inbox
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Never miss a bargain again with our timely alerts!
                </p>
              </div>
              <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="dialog-input_container">
                  <Image
                    src="/assets/icons/mail.svg"
                    alt="mail"
                    width={18}
                    height={18}
                  />
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="enter your email"
                    className="dialog-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="dialog-btn">
                  {isSubmitting ? "Submitting..." : "Track"}
                </button>
              </form>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
