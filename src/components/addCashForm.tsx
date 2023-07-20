import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

enum Stakes {
  ONE_TWO = "£1/£2",
  ONE_THREE = "£1/£3",
  TWO_FIVE = "£2/£5",
  FIVE_TEN = "£5/£10",
  TEN_TWENTY_FIVE = "£10/£25",
}

type SessionType = {
  date: Date;
  stakes: Stakes;
  buyIn: number;
  cashOut: number;
  duration: number;
};

type ErrorType = {
  buyIn: boolean;
  cashOut: boolean;
  duration: boolean;
};

const defaultFormState: SessionType = {
  date: new Date(),
  stakes: Stakes.ONE_TWO,
  buyIn: 0,
  cashOut: 0,
  duration: 0,
};

const defaultErrorState: ErrorType = {
  buyIn: false,
  cashOut: false,
  duration: false,
};

export const AddCashForm: React.FC = () => {
  const [formState, setFormState] =
    React.useState<SessionType>(defaultFormState);
  const [errors, setErrors] = useState<ErrorType>(defaultErrorState);
  const { data: sessionData } = useSession();

  const { refetch: refetchBankroll } = api.bankroll.getCurrentBankroll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const { refetch: refetchSessions } = api.session.getAllSessions.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const updateBankroll = api.bankroll.addDeposit.useMutation({
    onSuccess: () => {
      void refetchBankroll();
    },
  });

  const addSession = api.session.addSession.useMutation({
    onSuccess: (newSession) => {
      setFormState(defaultFormState);
      updateBankroll.mutate({ amount: newSession.profit });
      void refetchSessions();
    },
  });

  const onSubmit = () => {
    const newErrors = {
      buyIn: formState.buyIn <= 0,
      cashOut: formState.cashOut <= 0,
      duration: formState.duration <= 0,
    };
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    addSession.mutate({
      sessionData: {
        ...formState,
      },
    });
    const drawerToggle = document.getElementById(
      "my-drawer-4"
    ) as HTMLInputElement;

    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
      <div className="menu h-full w-80 bg-base-200 p-4 text-base-content">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Stakes</span>
          </label>
          <input
            value={formState.date.toISOString().substring(0, 10)}
            type="date"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              // Update form state
              setFormState((prevState) => ({
                ...prevState,
                date: new Date(e.target.value),
              }));
            }}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Stakes</span>
          </label>
          <select
            value={formState.stakes}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                stakes: e.target.value as Stakes,
              }))
            }
            className="select select-bordered"
          >
            <option value="£1/£2">1/2</option>
            <option value="£1/£3">1/3</option>
            <option value="£2/£5">2/5</option>
            <option value="£5/£10">5/10</option>
            <option value="£10/£25">10/25</option>
          </select>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Buy in</span>
          </label>
          <input
            value={formState.buyIn}
            type="number"
            placeholder="500"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              // Update form state
              setFormState((prevState) => ({
                ...prevState,
                buyIn: parseFloat(e.target.value),
              }));

              // If there was an error, reset the error state for the buyIn field
              if (errors.buyIn) {
                setErrors((prevState) => ({
                  ...prevState,
                  buyIn: false,
                }));
              }
            }}
          />
        </div>
        {errors.buyIn && (
          <div className="text-red-500">Buy in must be greater than 0</div>
        )}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Cash out</span>
          </label>
          <input
            value={formState.cashOut}
            type="number"
            placeholder="1500"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              // Update form state
              setFormState((prevState) => ({
                ...prevState,
                cashOut: parseFloat(e.target.value),
              }));

              // If there was an error, reset the error state for the cashOut field
              if (errors.cashOut) {
                setErrors((prevState) => ({
                  ...prevState,
                  cashOut: false,
                }));
              }
            }}
          />
        </div>
        {errors.cashOut && (
          <div className="text-red-500">Cash out must be greater than 0</div>
        )}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Duration (hours)</span>
          </label>
          <input
            value={formState.duration}
            type="number"
            placeholder="2.5"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              // Update form state
              setFormState((prevState) => ({
                ...prevState,
                duration: parseFloat(e.target.value),
              }));

              // If there was an error, reset the error state for the duration field
              if (errors.duration) {
                setErrors((prevState) => ({
                  ...prevState,
                  duration: false,
                }));
              }
            }}
          />
        </div>
        {errors.duration && (
          <div className="text-red-500">Duration must be greater than 0</div>
        )}
        <button
          disabled={Object.values(errors).some((error) => error)}
          onClick={onSubmit}
          className="btn btn-primary mt-4"
        >
          Add Session
        </button>
      </div>
    </div>
  );
};
