import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";

type TournamentType = {
  date: Date;
  buyIn: number;
  numEntrants: number;
  placeFinished: number;
  cashed: boolean;
  cashAmount: number;
};

type ErrorType = {
  buyIn: boolean;
  numEntrants: boolean;
  placeFinished: boolean;
};

const defaultFormState: TournamentType = {
  date: new Date(),
  buyIn: 0,
  numEntrants: 0,
  placeFinished: 0,
  cashed: false,
  cashAmount: 0,
};

const defaultErrorState: ErrorType = {
  buyIn: false,
  numEntrants: false,
  placeFinished: false,
};

export const AddTournamentForm: React.FC = () => {
  const [formState, setFormState] =
    React.useState<TournamentType>(defaultFormState);
  const [errors, setErrors] = useState<ErrorType>(defaultErrorState);
  const { data: sessionData } = useSession();

  const { refetch: refetchBankroll } = api.bankroll.getCurrentBankroll.useQuery(
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

  const { refetch: refetchTotals } =
    api.tournament.getTotals.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  const addTournament = api.tournament.addTournament.useMutation({
    onSuccess: (newTournament) => {
      setFormState(defaultFormState);
      updateBankroll.mutate({ amount: newTournament.profit });
      void refetchTotals();
    },
  });

  const onSubmit = () => {
    const newErrors = {
      buyIn: formState.buyIn <= 0,
      numEntrants: formState.numEntrants <= 0,
      placeFinished: formState.placeFinished <= 0,
    };
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    addTournament.mutate({
      tournamentData: {
        ...formState,
      },
    });
    const drawerToggle = document.getElementById(
      "add_tournament_session"
    ) as HTMLInputElement;

    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div className="drawer-side">
      <label
        htmlFor="add_tournament_session"
        className="drawer-overlay"
      ></label>
      <div className="menu h-full w-80 bg-base-200 p-4 text-base-content">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            value={formState.date.toISOString().substring(0, 10)}
            type="date"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                date: new Date(e.target.value),
              }));
            }}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Buy in</span>
          </label>
          <input
            value={formState.buyIn}
            type="number"
            placeholder="including rake eg: 150"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                buyIn: parseInt(e.target.value),
              }));
              if (errors.buyIn) {
                setErrors((prevState) => ({
                  ...prevState,
                  buyIn: false,
                }));
              }
            }}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">No. of entrants</span>
          </label>
          <input
            value={formState.numEntrants}
            type="number"
            placeholder="500"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                numEntrants: parseInt(e.target.value),
              }));
              if (errors.buyIn) {
                setErrors((prevState) => ({
                  ...prevState,
                  numEntrants: false,
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
            <span className="label-text">Finished</span>
          </label>
          <input
            value={formState.placeFinished}
            type="number"
            placeholder="3"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                placeFinished: parseFloat(e.target.value),
              }));
              if (errors.placeFinished) {
                setErrors((prevState) => ({
                  ...prevState,
                  placeFinished: false,
                }));
              }
            }}
          />
        </div>
        {errors.placeFinished && (
          <div className="text-red-500">Cash out must be greater than 0</div>
        )}
        <div className="form-control w-full max-w-xs">
          <label className="label cursor-pointer">
            <span className="label-text">Cashed?</span>
            <input
              type="checkbox"
              className="toggle toggle-accent"
              checked={formState.cashed}
              onChange={(e) => {
                setFormState((prevState) => ({
                  ...prevState,
                  cashed: e.target.checked,
                }));
              }}
            />
          </label>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Cash Amount</span>
          </label>
          <input
            value={formState.cashAmount}
            type="number"
            placeholder="1300"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                cashAmount: parseFloat(e.target.value),
              }));
            }}
          />
        </div>
        <button
          disabled={Object.values(errors).some((error) => error)}
          onClick={onSubmit}
          className="btn btn-primary mt-4"
        >
          Add Tournament
        </button>
      </div>
    </div>
  );
};
