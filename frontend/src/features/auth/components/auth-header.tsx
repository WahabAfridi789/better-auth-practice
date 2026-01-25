import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

const AuthHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <Card className="shadow-none bg-transparent border-none p-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AuthHeader;
