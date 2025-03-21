const fetchStatus = (isVip:boolean): Promise<{ isVip: boolean }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ isVip:!!isVip });
    }, 2000);
  });
};
export default () => {
  const vipStatu = ref({
    isVip: true,
  });
  const checkVip = async (isvip:boolean) => {
    vipStatu.value = await fetchStatus(isvip);
  };
  return {
    vipStatu,checkVip
  }
};
