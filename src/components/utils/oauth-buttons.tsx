import Button from "@/components/ui/button";

import {
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGoogleFilled
} from "@tabler/icons-react";

import { OAuthProviderName } from "@/types/user";

const PROVIDERS: {
  name: OAuthProviderName;
  icon: React.ReactNode;
}[] = [
  {
    name: "google",
    icon: <IconBrandGoogleFilled color="#FAFAFA" />
  },
  {
    name: "github",
    icon: <IconBrandGithub color="#FAFAFA" />
  },
  {
    name: "gitlab",
    icon: <IconBrandGitlab color="#FAFAFA" />
  }
];

interface Props {
  className?: string;
}

export default function OAuthButtons({ className }: Props) {
  return (
    <div className="flex justify-between items-center w-full">
      {PROVIDERS.map((provider) => (
        <Button
          key={provider.name}
          variant="ghost"
          type="link"
          href={`/api/auth/oauth/${provider.name}`}
          size="w-28"
          className={`border border-neutral-900 p-2 flex items-center justify-center hover:bg-neutral-900 ${className ?? ""}`}
          ariaLabel={`Continue with ${provider.name}`}>
          {provider.icon}
        </Button>
      ))}
    </div>
  );
}
