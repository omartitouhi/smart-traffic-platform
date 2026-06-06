import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";
import { DashboardHome } from "@/features/dashboard/dashboard-home";
import { CreateVehicleForm } from "@/features/vehicles/create-vehicle-form";
import { VehicleDetails } from "@/features/vehicles/vehicle-details";
import { VehiclesList } from "@/features/vehicles/vehicles-list";
import {
  DELETE_VEHICLE_MUTATION,
  SIMULATE_VEHICLE_POSITION_MUTATION,
} from "@/graphql/mutations/vehicle.mutations";
import type { AuthUser } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

const authUser: AuthUser = {
  id: "user-1",
  email: "operator@example.com",
  firstName: "Traffic",
  lastName: "Operator",
  role: "OPERATOR",
};

const vehicle = {
  id: "vehicle-1",
  matricule: "TN-1234",
  brand: "Toyota",
  model: "Corolla",
  type: "SEDAN",
  status: "ACTIVE",
  createdAt: "2026-06-02T08:00:00.000Z",
  updatedAt: "2026-06-02T09:00:00.000Z",
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
  }),
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: () => ({
    user: authUser,
    isAuthenticated: true,
    isInitializing: false,
    login: mocks.login,
    register: mocks.register,
    logout: mocks.logout,
  }),
}));

vi.mock("@/components/ui/toast", () => ({
  notify: {
    success: mocks.notifySuccess,
    error: mocks.notifyError,
    info: vi.fn(),
  },
  ToastViewport: () => null,
}));

vi.mock("@/components/map/interactive-map", () => ({
  InteractiveMap: () => null,
}));

vi.mock("@apollo/client/react", () => ({
  useQuery: (...args: unknown[]) => mocks.useQuery(...args),
  useMutation: (...args: unknown[]) => mocks.useMutation(...args),
}));

function resetApolloMocks() {
  mocks.useQuery.mockReturnValue({
    data: undefined,
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  });
  mocks.useMutation.mockReturnValue([vi.fn().mockResolvedValue({ data: {} }), { loading: false }]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.login.mockResolvedValue({ user: authUser, accessToken: "access", refreshToken: "refresh" });
  mocks.register.mockResolvedValue({ user: authUser, accessToken: "access", refreshToken: "refresh" });
  mocks.logout.mockResolvedValue(undefined);
  resetApolloMocks();
});

describe("Login page", () => {
  it("renders the login form", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
  });

  it("validates required fields and submits valid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(screen.getByText("L'email est obligatoire.")).toBeInTheDocument();
    expect(screen.getByText("Le mot de passe est obligatoire.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "Operator@Example.COM");
    await user.type(screen.getByLabelText("Mot de passe"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await waitFor(() => {
      expect(mocks.login).toHaveBeenCalledWith({
        email: "operator@example.com",
        password: "Password123!",
      });
    });
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
    expect(mocks.notifySuccess).toHaveBeenCalledWith("Connexion reussie.");
  });
});

describe("Register page", () => {
  it("renders the register form and password toggle", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name: "Creation de compte" })).toBeInTheDocument();
    expect(screen.getByLabelText("Prenom")).toBeInTheDocument();
    expect(screen.getByLabelText("Afficher le mot de passe")).toBeInTheDocument();
  });

  it("validates fields and submits valid registration data", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.click(screen.getByRole("button", { name: "Creer le compte" }));

    expect(screen.getByText("Le prenom est obligatoire.")).toBeInTheDocument();
    expect(screen.getByText("Le nom est obligatoire.")).toBeInTheDocument();
    expect(screen.getByText("L'email est obligatoire.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Prenom"), "Traffic");
    await user.type(screen.getByLabelText("Nom"), "Operator");
    await user.type(screen.getByLabelText("Email"), "Operator@Example.COM");
    await user.type(screen.getByLabelText("Mot de passe"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Creer le compte" }));

    await waitFor(() => {
      expect(mocks.register).toHaveBeenCalledWith({
        firstName: "Traffic",
        lastName: "Operator",
        email: "operator@example.com",
        password: "Password123!",
      });
    });
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
  });
});

describe("Dashboard page", () => {
  it("renders dashboard content and handles logout", async () => {
    const user = userEvent.setup();
    render(<DashboardHome />);

    expect(screen.getByText("Bonjour, Traffic Operator")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Management")).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Logout" }));

    expect(mocks.logout).toHaveBeenCalled();
  });
});

describe("Vehicles list page", () => {
  it("renders loading, error and empty states", () => {
    mocks.useQuery.mockReturnValueOnce({
      loading: true,
      data: undefined,
      error: undefined,
      refetch: vi.fn(),
    });
    const { rerender } = render(<VehiclesList />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();

    mocks.useQuery.mockReturnValueOnce({
      loading: false,
      data: undefined,
      error: new Error("Network error"),
      refetch: vi.fn(),
    });
    rerender(<VehiclesList />);
    expect(screen.getByText("Liste indisponible")).toBeInTheDocument();

    mocks.useQuery.mockReturnValueOnce({
      loading: false,
      data: { vehicles: [] },
      error: undefined,
      refetch: vi.fn(),
    });
    rerender(<VehiclesList />);
    expect(screen.getByText("Aucun vehicule")).toBeInTheDocument();
  });

  it("renders vehicles, filters by matricule and confirms delete", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    const deleteVehicle = vi.fn().mockResolvedValue({ data: { deleteVehicle: true } });
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: { vehicles: [vehicle] },
      error: undefined,
      refetch,
    });
    mocks.useMutation.mockReturnValue([deleteVehicle, { loading: false }]);

    render(<VehiclesList />);

    expect(screen.getByText("TN-1234")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Recherche"), "missing");
    expect(screen.getByText("Aucun resultat")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Recherche"));
    await user.type(screen.getByLabelText("Recherche"), "TN-1234");
    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Supprimer le vehicule")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Supprimer" }));

    await waitFor(() => {
      expect(deleteVehicle).toHaveBeenCalledWith({
        variables: { id: vehicle.id },
        refetchQueries: expect.any(Array),
        awaitRefetchQueries: true,
      });
    });
    expect(refetch).toHaveBeenCalled();
  });
});

describe("Create vehicle page", () => {
  it("validates required fields and creates a vehicle", async () => {
    const user = userEvent.setup();
    const createVehicle = vi.fn().mockResolvedValue({ data: { createVehicle: vehicle } });
    mocks.useMutation.mockReturnValue([createVehicle, { loading: false }]);

    render(<CreateVehicleForm />);

    await user.click(screen.getByRole("button", { name: "Creer vehicule" }));
    expect(screen.getByText("Le matricule est obligatoire.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Matricule"), "tn-1234");
    await user.type(screen.getByLabelText("Brand"), "Toyota");
    await user.type(screen.getByLabelText("Model"), "Corolla");
    await user.type(screen.getByLabelText("Type"), "SEDAN");
    await user.type(screen.getByLabelText("Status"), "ACTIVE");
    await user.click(screen.getByRole("button", { name: "Creer vehicule" }));

    await waitFor(() => {
      expect(createVehicle).toHaveBeenCalledWith({
        variables: {
          input: {
            matricule: "TN-1234",
            brand: "Toyota",
            model: "Corolla",
            type: "SEDAN",
            status: "ACTIVE",
          },
        },
      });
    });
    expect(mocks.replace).toHaveBeenCalledWith("/vehicles");
  });
});

describe("Vehicle detail page", () => {
  it("renders loading, error and detail states", () => {
    mocks.useQuery.mockReturnValueOnce({
      loading: true,
      data: undefined,
      error: undefined,
      refetch: vi.fn(),
    });
    const { rerender } = render(<VehicleDetails vehicleId={vehicle.id} />);
    expect(screen.getByText("Chargement du vehicule...")).toBeInTheDocument();

    mocks.useQuery.mockReturnValueOnce({
      loading: false,
      data: undefined,
      error: new Error("Network error"),
      refetch: vi.fn(),
    });
    rerender(<VehicleDetails vehicleId={vehicle.id} />);
    expect(screen.getByText("Detail indisponible")).toBeInTheDocument();

    mocks.useQuery.mockReturnValueOnce({
      loading: false,
      data: { vehicle },
      error: undefined,
      refetch: vi.fn(),
    });
    rerender(<VehicleDetails vehicleId={vehicle.id} />);
    expect(screen.getByRole("heading", { name: "TN-1234" })).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();
  });

  it("simulates GPS position and deletes a vehicle", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    const simulatePosition = vi.fn().mockResolvedValue({ data: {} });
    const deleteVehicle = vi.fn().mockResolvedValue({ data: { deleteVehicle: true } });
    mocks.useQuery.mockReturnValue({
      loading: false,
      data: { vehicle },
      error: undefined,
      refetch,
    });
    mocks.useMutation.mockImplementation((operation) => {
      if (operation === SIMULATE_VEHICLE_POSITION_MUTATION) {
        return [simulatePosition, { loading: false }];
      }

      if (operation === DELETE_VEHICLE_MUTATION) {
        return [deleteVehicle, { loading: false }];
      }

      return [vi.fn(), { loading: false }];
    });

    render(<VehicleDetails vehicleId={vehicle.id} />);

    await user.click(screen.getByRole("button", { name: "Ajouter position GPS simulee" }));
    await waitFor(() => {
      expect(simulatePosition).toHaveBeenCalledWith({
        variables: { vehicleId: vehicle.id },
      });
    });
    expect(refetch).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Supprimer" }));

    await waitFor(() => {
      expect(deleteVehicle).toHaveBeenCalledWith({
        variables: { id: vehicle.id },
        refetchQueries: expect.any(Array),
        awaitRefetchQueries: true,
      });
    });
    expect(mocks.replace).toHaveBeenCalledWith("/vehicles");
  });
});
