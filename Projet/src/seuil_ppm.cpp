#include <stdio.h>
#include <iostream>
#include "image_ppm.h"
using namespace std;
int main(int argc, char* argv[])
{
  char cNomImgLue[250], cNomImgEcrite[250];
  int nH, nW, nTaille, nbSeuil;

  if (argc < 4 || argc%3!=0)
  {
    printf("Usage: ImageIn.pgm ImageOut.pgm SeuilRouge1 SeuilVert1 SeuilBleu1 SeuilRouge2 SeuilVert2 SeuilBleu2 ... \n");
    exit (1) ;
  }
  sscanf (argv[1],"%s",cNomImgLue);
  sscanf (argv[2],"%s",cNomImgEcrite);
  nbSeuil = (argc -3)/3;
  int rS[nbSeuil];
  int vS[nbSeuil];
  int bS[nbSeuil];
  for(int i=0;i<nbSeuil;i++){
    sscanf (argv[3+i*3],"%d",&rS[i]);
    sscanf (argv[4+i*3],"%d",&vS[i]);
    sscanf (argv[5+i*3],"%d",&bS[i]);
  }

  OCTET *ImgIn, *ImgOut;

  lire_nb_lignes_colonnes_image_ppm(cNomImgLue, &nH, &nW);
  nTaille = nH * nW;

  allocation_tableau(ImgIn, OCTET, nTaille *3);
  lire_image_ppm(cNomImgLue, ImgIn, nTaille);
  allocation_tableau(ImgOut, OCTET, nTaille *3);



  for (int i=0; i < nH; i++)
  {
    for (int j=0; j < nW; j++)
    {
      int pixelId =3*(i*nW+j);
      //r
      for(int s=0; s<nbSeuil; s++)
      {
        if ( ImgIn[pixelId] < rS[s])
        {
          ImgOut[pixelId]=s *255/nbSeuil;
          break;
        }else{
          ImgOut[pixelId]=255;
        }
      }
      //v
      for(int s=0; s<nbSeuil; s++)
      {
        if( ImgIn[pixelId+1] < vS[s])
        {
          ImgOut[pixelId +1]=s *255/nbSeuil;
          break;
        }else{
          ImgOut[pixelId +1]=255;
        }
      }
      //b
      for(int s=0; s<nbSeuil; s++)
      {
        if(ImgIn[pixelId+2] < bS[s])
        {
          ImgOut[pixelId+2]=s *255/nbSeuil;
          break;
        }else{
          ImgOut[pixelId+2]=255;
        }
      }
    }
  }

  ecrire_image_ppm(cNomImgEcrite, ImgOut,  nH, nW);
  free(ImgIn);
  return 1;
}
