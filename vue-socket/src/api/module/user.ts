import { GET, POST, PUT, DELETE } from "@/utils/request";

export function arealist({ data }: { data?: any }) {
  return POST("/salary/v1/common/phone/area/list", { data });
}
