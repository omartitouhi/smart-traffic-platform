export const vehicleFeature = {
  routes: {
    list: "/vehicles",
    create: "/vehicles/create",
    details: (id: string) => `/vehicles/${id}`,
    positions: (id: string) => `/vehicles/${id}/positions`,
  },
};
