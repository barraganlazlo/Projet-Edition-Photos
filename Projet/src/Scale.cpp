#include "image_ppm.h"
#include <stdio.h>
#include <iostream>
#include <fstream>

int main(int argc, char **argv){
    char cNomImgLue[250], cNomBinary[250], cNomImgEcrite[250];
    int nH, nW, nTaille, powerBlur = 1;

    if (argc < 5)
    {
      printf("Usage: ImageIn.ppm Binary.pgm ImageOut.ppm powerBlur\n");
      exit (1) ;
    }
    sscanf (argv[1],"%s",cNomImgLue);
    sscanf (argv[2],"%s",cNomBinary);
    sscanf (argv[3],"%s",cNomImgEcrite);
    sscanf (argv[4],"%d",&powerBlur);

    cout << powerBlur << endl;

    OCTET *ImgIn, *Binary, *ImgOut;

    lire_nb_lignes_colonnes_image_ppm(cNomImgLue, &nH, &nW);
    nTaille = nH * nW;

    allocation_tableau(ImgIn, OCTET, nTaille *3);
    allocation_tableau(Binary, OCTET, nTaille);
    lire_image_ppm(cNomImgLue, ImgIn, nTaille);
    lire_image_pgm(cNomBinary, Binary, nTaille);
    allocation_tableau(ImgOut, OCTET, nTaille * 3);


    ecrire_image_ppm(cNomImgEcrite, ImgOut,  nH, nW);
    free(ImgIn);
    free(ImgOut);

    return 0;
}
