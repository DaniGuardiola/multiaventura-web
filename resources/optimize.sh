mogrify -gravity north -resize 600x99999 -crop 99999x340^+0+0 actividad/*

mogrify -gravity north -resize 965x99999 barra/*
mogrify -gravity north -resize 965x99999 espeleo/*
mogrify -gravity north -resize 965x99999 paint/*
mogrify -gravity north -resize 965x99999 pira/*

mogrify -gravity north -resize 1400x99999 conocenos/*
mogrify -gravity north -resize 1400x99999 slider/*

chmod 644 **/*
chmod 775 optimize.sh
