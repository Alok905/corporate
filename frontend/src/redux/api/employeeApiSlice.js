import apiSlice from "./apiSlice";
import { EMPLOYEE_URL } from "../constants";

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${EMPLOYEE_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${EMPLOYEE_URL}/logout`,
        method: "POST",
      }),
    }),
    getOwnReportees: builder.query({
      query: () => ({
        url: `${EMPLOYEE_URL}/reportees`,
        method: "GET",
      }),
    }),
    getOwnReporteesHierarchy: builder.query({
      query: () => ({
        url: `${EMPLOYEE_URL}/reportees/hierarchy`,
        method: "GET",
      }),
    }),
    updateOwnProfile: builder.mutation({
      query: (data) => ({
        url: `${EMPLOYEE_URL}/update`,
        method: "PUT",
        body: data,
      }),
    }),
    getOwnApprovals: builder.query({
      query: (status) => ({
        url: `${EMPLOYEE_URL}/approval?status${status ? status : ""}`,
        method: "GET",
      }),
    }),
    respondApproval: builder.mutation({
      query: (data, approvalId) => ({
        url: `${EMPLOYEE_URL}/aproval/${approvalId}`,
        body: data,
        method: "PUT",
      }),
    }),
    // Admin Routes
    searchEmployee: builder.query({
      query: (search) => ({
        url: `${EMPLOYEE_URL}/?search=${search}`,
        method: "GET",
      }),
    }),
    registerEmployee: builder.mutation({
      query: (data) => ({
        url: `${EMPLOYEE_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    getEmployeeReportees: builder.query({
      query: (empId) => ({
        url: `${EMPLOYEE_URL}/${empId}/reportees`,
        method: "GET",
      }),
    }),
    updateEmployeeProfile: builder.mutation({
      query: (data, empId) => ({
        url: `${EMPLOYEE_URL}/update/${empId}`,
        body: data,
        method: "PUT",
      }),
    }),
    getEmployeeReporteesHierarchy: builder.query({
      query: (empId) => ({
        url: `${EMPLOYEE_URL}/${empId}/reportees/hierarchy`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetOwnReporteesQuery,
  useGetOwnReporteesHierarchyQuery,
  useUpdateOwnProfileMutation,
  useGetOwnApprovalsQuery,
  useRespondApprovalMutation,
  // ADMIN
  useSearchEmployeeQuery,
  useRegisterEmployeeMutation,
  useGetEmployeeReporteesQuery,
  useUpdateEmployeeProfileMutation,
  useGetEmployeeReporteesHierarchyQuery,
} = employeeApiSlice;
