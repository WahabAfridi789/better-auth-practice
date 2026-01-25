//logout icon from heroicons

import {
  EyeSlashIcon,
  EyeIcon,
  Bars3Icon,
  HomeIcon,
  StarIcon,
  BellIcon,
  CogIcon,
  Cog6ToothIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  UsersIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  UserPlusIcon,
  PhotoIcon,
  CheckIcon,
  PrinterIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import { CloudArrowDownIcon, CloudArrowUpIcon, ArrowDownTrayIcon, UserCircleIcon, UserIcon as UserIconFilled, CalendarDateRangeIcon, CalendarDaysIcon } from "@heroicons/react/24/solid"


export type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const Icons = {
  Eye: EyeIcon,
  EyeSlash: EyeSlashIcon,
  Menu: Bars3Icon,
  Home: HomeIcon,
  Star: StarIcon,
  Bell: BellIcon,
  Cog: CogIcon,
  User: UserIcon,
  Users: UsersIcon,
  ChartBar: ChartBarIcon,
  DocumentText: DocumentTextIcon,
  ArrowRight: ArrowRightIcon,
  Logout: ArrowRightEndOnRectangleIcon,
  Sort: ArrowsUpDownIcon,
  SortDesc: BarsArrowDownIcon,
  SortAsc: BarsArrowUpIcon,
  UserPlus: UserPlusIcon,
  Cog6Tooth: Cog6ToothIcon,
  Key: KeyIcon,
  ShieldCheck: ShieldCheckIcon,
  ShieldExclamation: ShieldExclamationIcon,
  Photo: PhotoIcon,
  FileText: DocumentTextIcon,
  FileCheck: CheckCircleIcon,
  DownloadFilled: CloudArrowDownIcon,
  UploadFilled: CloudArrowUpIcon,
  Export: ArrowDownTrayIcon,
  Printer: PrinterIcon,
  UserCircleFilled: UserCircleIcon,
  UserIconFilled,
  CalendarDateRangeIconFilled: CalendarDateRangeIcon,
  CalendarDaysIconFilled: CalendarDaysIcon
};
