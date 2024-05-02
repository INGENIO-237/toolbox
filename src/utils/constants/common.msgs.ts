const COMMON_MSG = {
  notFound: (target: string) => {
    return `${target} Not Found`;
  },
  inUse: (field: string) => {
    return `${field} already in use by another account`;
  },
  invalid: (field: string) => {
    return `Invalid ${field}. Retry.`;
  },
  unregistered: (field: string) => {
    return `Unregistred ${field}`;
  },
  otpSent: (mediator = "email address") =>
    `An OTP code has been sent to your ${mediator}. Please check it.`,
};

export default COMMON_MSG;
