use strict;
use warnings;
use IO::Socket::INET;

my $root = 'C:/Users/pepij/examenapp-havo';
my $port = $ENV{PORT} || 8080;

my %types = (
    html => 'text/html; charset=utf-8',
    css  => 'text/css',
    js   => 'application/javascript',
    json => 'application/json',
    svg  => 'image/svg+xml',
    png  => 'image/png',
    jpg  => 'image/jpeg',
    ico  => 'image/x-icon',
    txt  => 'text/plain',
    xml  => 'application/xml',
);

my $server = IO::Socket::INET->new(
    LocalPort => $port,
    Listen    => 20,
    ReuseAddr => 1,
    Proto     => 'tcp',
) or die "Cannot bind to port $port: $!\n";

print "Serving $root on http://localhost:$port\n";
$| = 1;

while (my $client = $server->accept()) {
    my $req = '';
    while (my $line = <$client>) {
        $req .= $line;
        last if $line =~ /^\r?\n$/;
    }
    my ($path) = $req =~ /^\w+\s+(\S+)/;
    $path ||= '/';
    $path =~ s/\?.*//;
    $path = '/index.html' if $path eq '/' || $path eq '';
    $path =~ s/\.\.//g;
    my $file = $root . $path;
    $file =~ s|/|\\|g;
    if (-f $file) {
        open my $fh, '<:raw', $file or do {
            print $client "HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n";
            close $client; next;
        };
        local $/;
        my $data = <$fh>;
        close $fh;
        my ($ext) = $file =~ /\.([^.]+)$/;
        my $ct = $types{lc($ext||'')} || 'application/octet-stream';
        my $len = length($data);
        print $client "HTTP/1.1 200 OK\r\nContent-Type: $ct\r\nContent-Length: $len\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-cache\r\n\r\n";
        print $client $data;
    } else {
        my $body = "Not Found";
        print $client "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\n$body";
    }
    close $client;
}
