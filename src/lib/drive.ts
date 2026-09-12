export type DriveCategory = {
  key: string;
  label: string;
  folderId: string;
  folderUrl: string;
  icon: string;
  command: string;
};

export const DRIVE_CATEGORIES: DriveCategory[] = [
  {
    key: "صور",
    label: "صور",
    folderId: "1lnR1ReFWrphuS8cOuKJBu-hSRzuye9dG",
    folderUrl: "https://drive.google.com/drive/folders/1lnR1ReFWrphuS8cOuKJBu-hSRzuye9dG?usp=drive_link",
    icon: "▧",
    command: "images/",
  },
  {
    key: "افتار",
    label: "افتار",
    folderId: "1wJogBgvY6cvS-_S_6Xjez1cIfeXUxXBU",
    folderUrl: "https://drive.google.com/drive/folders/1wJogBgvY6cvS-_S_6Xjez1cIfeXUxXBU?usp=drive_link",
    icon: "◉",
    command: "avatars/",
  },
  {
    key: "اعلانات",
    label: "إعلانات",
    folderId: "1p2yHeegYOTaXBgiOFcQYEN6Utgl30zuf",
    folderUrl: "https://drive.google.com/drive/folders/1p2yHeegYOTaXBgiOFcQYEN6Utgl30zuf?usp=drive_link",
    icon: "◈",
    command: "ads/",
  },
  {
    key: "صوتيات",
    label: "صوتيات",
    folderId: "1khKlM3aT6JrDcpyOWbfW-_3Wx3LGz55i",
    folderUrl: "https://drive.google.com/drive/folders/1khKlM3aT6JrDcpyOWbfW-_3Wx3LGz55i?usp=drive_link",
    icon: "♫",
    command: "audio/",
  },
  {
    key: "عروض تقديمية",
    label: "عروض تقديمية",
    folderId: "1lKwItTNDRzeFI-KaASSgyaG0kJmD70-P",
    folderUrl: "https://drive.google.com/drive/folders/1lKwItTNDRzeFI-KaASSgyaG0kJmD70-P?usp=drive_link",
    icon: "▤",
    command: "presentations/",
  },
];

export function driveFileUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/view?usp=drive_link`;
}

export function drivePreviewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function driveDownloadUrl(id: string) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

export function driveThumbnailUrl(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
}
